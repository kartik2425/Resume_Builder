import React, { useState } from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { Field, reduxForm, reducer as formReducer } from "redux-form";
import { Provider, connect } from "react-redux";
import { createStore, combineReducers } from "redux";

// Step 1: Define the ResumeForm component
const ResumeForm = (props) => {
  const { handleSubmit, change } = props;
  const history = useNavigate();

  // Step 2: Define the state to hold resume data
  const [education, setEducation] = useState([
    { institute: "", year: "", degree: "" },
  ]);
  const [experience, setExperience] = useState([
    { company: "", year: "", designation: "" },
  ]);
  const [skills, setSkills] = useState([]);
  const [skillValue, setSkillValue] = useState("");

  // Step 3: Define form submission handler
  const onSubmit = (data,history) => {
    console.log(data); // Log the resume data on form submission

    // Redirect to the "View Resume" page
    history.push("/view");
  };

  // Step 4: Define helper functions to handle dynamic fields
  const handleAddField = (field, setField) => {
    setField([...field, {}]);
  };

  const handleFieldChange = (index, field, setField, event) => {
    const { name, value } = event.target;
    const updatedFields = [...field];
    updatedFields[index][name] = value;
    setField(updatedFields);
  };

  const handleRemoveField = (index, field, setField) => {
    const updatedFields = [...field];
    updatedFields.splice(index, 1);
    setField(updatedFields);
  };

  const handleAddSkill = () => {
    const formValues = props.formValues;
    const newSkill = formValues.skills
      ? [...formValues.skills, skillValue]
      : [skillValue];
    setSkillValue("");
    change("skills", newSkill);
  };

  return (
    <form class="container" onSubmit={handleSubmit(onSubmit)}>
      <h1>Create Resume</h1>
      return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Create Resume</h1>

        {/* Personal Information */}
        <h2>Personal Information</h2>
        <div>
          <label htmlFor="name">Name</label>
          <Field name="name" component="input" type="text" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <Field name="email" component="input" type="email" />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <Field name="address" component="input" type="text" />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <Field name="phone" component="input" type="tel" />
        </div>

        {/* Education */}
        <h2>Education</h2>
        {education.map((edu, index) => (
          <div key={index}>
            <label htmlFor={`education[${index}].institute`}>Institute</label>
            <Field
              name={`education[${index}].institute`}
              component="input"
              type="text"
              onChange={(event) =>
                handleFieldChange(index, education, setEducation, event)
              }
            />
            <label htmlFor={`education[${index}].year`}>Year</label>
            <Field
              name={`education[${index}].year`}
              component="input"
              type="text"
              onChange={(event) =>
                handleFieldChange(index, education, setEducation, event)
              }
            />
            <label htmlFor={`education[${index}].degree`}>Degree</label>
            <Field
              name={`education[${index}].degree`}
              component="input"
              type="text"
              onChange={(event) =>
                handleFieldChange(index, education, setEducation, event)
              }
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() =>
                  handleRemoveField(index, education, setEducation)
                }
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField(education, setEducation)}
        >
          Add Education
        </button>

        {/* Experience */}
        <h2>Experience</h2>
        {experience.map((exp, index) => (
          <div key={index}>
            <label htmlFor={`experience[${index}].company`}>Company</label>
            <Field
              name={`experience[${index}].company`}
              component="input"
              type="text"
              onChange={(event) =>
                handleFieldChange(index, experience, setExperience, event)
              }
            />
            <label htmlFor={`experience[${index}].year`}>Year</label>
            <Field
              name={`experience[${index}].year`}
              component="input"
              type="text"
              onChange={(event) =>
                handleFieldChange(index, experience, setExperience, event)
              }
            />
            <label htmlFor={`experience[${index}].designation`}>
              Designation
            </label>
            <Field
              name={`experience[${index}].designation`}
              component="input"
              type="text"
              onChange={(event) =>
                handleFieldChange(index, experience, setExperience, event)
              }
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() =>
                  handleRemoveField(index, experience, setExperience)
                }
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField(experience, setExperience)}
        >
          Add Experience
        </button>

        {/* Skills */}
        <h2>Skills</h2>
        <div>
          {skills.map((skill, index) => (
            <span key={index}>{skill} </span>
          ))}
        </div>
        <div>
          <Field
            name="skillValue"
            component="input"
            type="text"
            value={skillValue}
            onChange={(event) => setSkillValue(event.target.value)}
          />
          <button type="button" onClick={handleAddSkill}>
            Add Skill
          </button>
        </div>

        {/* Submit button */}
        <button type="submit">Submit</button>
      </form>
      );
    </form>
  );
};

// Step 6: Wrap the form component with reduxForm
const ResumeFormContainer = reduxForm({
  form: "resumeForm",
})(ResumeForm);

// Step 7: Define the ResumeView component to display the resume
const ResumeView = (props) => {
  const { resumeData } = props;

  if (!resumeData) {
    return null; // or display a loading message
  }

  const renderEducation = () => {
    if (!resumeData.education || resumeData.education.length === 0) {
      return null;
    }

    return resumeData.education.map((educationItem, index) => (
      <div key={index}>
        <p>Institute: {educationItem.institute}</p>
        <p>Year: {educationItem.year}</p>
        <p>Degree: {educationItem.degree}</p>
      </div>
    ));
  };

  const renderExperience = () => {
    if (!resumeData.experience || resumeData.experience.length === 0) {
      return null;
    }

    return resumeData.experience.map((experienceItem, index) => (
      <div key={index}>
        <p>Company: {experienceItem.company}</p>
        <p>Year: {experienceItem.year}</p>
        <p>Designation: {experienceItem.designation}</p>
      </div>
    ));
  };

  const renderSkills = () => {
    if (!resumeData.skills || !Array.isArray(resumeData.skills)) {
      return null;
    }

    return resumeData.skills.map((skill, index) => <p key={index}>{skill}</p>);
  };

  return (
    <div class="container">
      <h2>View Resume</h2>
      <p>Name: {resumeData.name || ""}</p>
      <p>Email: {resumeData.email || ""}</p>
      <p>Address: {resumeData.address || ""}</p>
      <p>Phone: {resumeData.phone || ""}</p>

      <h3>Education</h3>
      {renderEducation()}

      <h3>Experience</h3>
      {renderExperience()}

      <h3>Skills</h3>
      {renderSkills()}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    resumeData:
      state.form && state.form.resumeForm && state.form.resumeForm.values
        ? state.form.resumeForm.values
        : {},
  };
};

const ConnectedResumeView = connect(mapStateToProps)(ResumeView);

// Step 8: Define the App component with routes
const App = () => {
  // Create the Redux store
  const rootReducer = combineReducers({
    form: formReducer, // Add the form reducer
  });

  const store = createStore(rootReducer);
  return (
    <Provider store={store}>
      <Router>
        <div>
          {/* Navigation */}
          <nav>
            <ul>
              <li>
                <Link to="/create">Create Resume</Link>
              </li>
              <li>
                <Link to="/view">View Resume</Link>
              </li>
            </ul>
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/create" element={<ResumeFormContainer />} />
            <Route path="/view" element={<ConnectedResumeView />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;