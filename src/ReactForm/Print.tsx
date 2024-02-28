import React from "react";
import {  FormData } from "./Form"; // Import the entire FormComponent file
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

interface PrintPageProps {
  formData: FormData;
}

const PrintPage: React.FC<PrintPageProps> = ({ formData }) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Printable Form Data</h1>
      <div className="mb-4">
        <strong>First Name:</strong> {formData.firstName}
      </div>
      <div className="mb-4">
        <strong>Last Name:</strong> {formData.lastName}
      </div>
      <div className="mb-4">
        <strong>Education:</strong> {formData.education}
      </div>
      {/* Add other form fields here */}
      <div className="mb-4">
        <strong>Profile Photo:</strong>{" "}
        {formData.profilePhoto ? "Uploaded" : "Not Uploaded"}
      </div>
      <div className="mb-4">
        <strong>Cover Photo:</strong>{" "}
        {formData.coverPhoto ? "Uploaded" : "Not Uploaded"}
      </div>
      {/* Add other form fields here */}
    </div>
  );
};

export default PrintPage;
