export default 'test'
// import React, { Component } from "react";
// import Input from "./input";
// import Select from "./select";
// import TextArea from "./textArea";

// class Form extends Component {
//   state = {
//     data: {},
//     errors: {}
//   };

//   validate = () => {
//     const options = { abortEarly: false };
//     // const { error } = Joi.validate(this.state.data, this.schema, options);
//     return null;

//     // const errors = {};
//     // for (let item of error.details) errors[item.path[0]] = item.message;
//     // return errors;
//   };

//   validateProperty = ({ name, value }) => {
//     const obj = { [name]: value };
//     // const schema = { [name]: this.schema[name] };
//     // const { error } = Joi.validate(obj, schema);
//     return null;
//   };

//   handleSubmit = e => {
//     e.preventDefault();

//     const errors = this.validate();
//     this.setState({ errors: errors || {} });
//     if (errors) return;

//     this.doSubmit();
//   };

//   handleChange = ({ currentTarget: input }) => {
//     const errors = { ...this.state.errors };
//     const errorMessage = this.validateProperty(input);
//     if (errorMessage) errors[input.name] = errorMessage;
//     else delete errors[input.name];

//     const data = { ...this.state.data };
//     data[input.name] = input.value;

//     this.setState({ data, errors });
//   };

//   renderButton(label) {
//     return (
//       <button disabled={this.validate()} className="btn btn-success">
//         {label}
//       </button>
//     );
//   }

//   renderSelect(name, label, disabled, options) {
//     const { data, errors } = this.state;

//     return (
//       <Select
//         name={name}
//         value={data[name]}
//         label={label}
//         options={options}
//         onChange={this.handleChange}
//         error={errors[name]}
//         disabled={disabled}
//       />
//     );
//   }

//   renderTextArea(name, label, disabled, type = "text") {
//     const { data, errors } = this.state;
//     return (
//       <TextArea
//         type={type}
//         name={name}
//         value={data[name]}
//         label={label}
//         onChange={this.handleChange}
//         error={errors[name]}
//         disabled={disabled}
//       />
//     );
//   }

//   renderInput(name, label, disabled, type = "text") {
//     const { data, errors } = this.state;

//     return (
//       <Input
//         type={type}
//         name={name}
//         value={data[name]}
//         label={label}
//         onChange={this.handleChange}
//         error={errors[name]}
//         disabled={disabled}
//       />
//     );
//   }
// }

// export default Form;
