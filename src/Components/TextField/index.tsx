import { ErrorMessage, Field, useField } from "formik";
import React, { InputHTMLAttributes, ReactNode } from "react";

import "./TextField.scss";

interface ITextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  as?: string;
  [key: string]: any;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const TextField: React.FC<ITextFieldProps> = ({
  name,
  leftIcon,
  rightIcon,
  as,
  ...rest
}) => {
  const [field, meta] = useField(name); // Get field and meta data
  const isError = meta.touched && meta.error; // Check if field has been touched and has error

  return (
    <div className="form_input">
      {/* <label className="form_input-label" htmlFor={name}>
        {label}
      </label> */}
      <div
        className="field"
        style={{ border: !isError ? "1px solid #ddd" : "1px solid #c22828" }}
      >
        {leftIcon && <span className="text-left-icon">{leftIcon}</span>}
        <Field
          style={{ paddingLeft: leftIcon ? "8px" : "1.6rem" }}
          name={name}
          id={name}
          as={as}
          {...rest}
        />
        {rightIcon && <span className="text-right-icon">{rightIcon}</span>}
      </div>

      <ErrorMessage
        component={"div"}
        name={name}
        className={"form_input-error"}
      />
    </div>
  );
};

export default TextField;
