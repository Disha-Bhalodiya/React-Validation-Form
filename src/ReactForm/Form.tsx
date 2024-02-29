import React, { useState } from "react";
import * as Yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface FormData {
  firstName: string;
  lastName: string;
  education?: string;
  dob: string;
  email: string;
  previousProjects: { projectName: string; projectDescription: string }[];
  cvType: string;
  cvLink?: string;
  cvFile?: FileList | null;
  degreeTypes?: string[];
  address?: string;
  mobileNumber: string;
  pinCode?: string;
  emergencyNumber?: string;
  profilePhoto: FileList | null;
  coverPhoto?: FileList | null;
  yearsOfExperience: number;
  skills: string[];
  selfDescription: string;
  acceptTerms: boolean;
  [key: string]: any;
}
const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  education: "",
  dob: "",
  email: "",
  previousProjects: [{ projectName: "", projectDescription: "" }],
  cvType: "online",
  cvLink: "",
  cvFile: null,
  degreeTypes: [],
  address: "",
  mobileNumber: "",
  pinCode: "",
  emergencyNumber: "",
  profilePhoto: null,
  coverPhoto: null,
  yearsOfExperience: 0,
  skills: [],
  selfDescription: "",
  acceptTerms: false,
};

const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, value],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        skills: prevData.skills.filter((skill: string) => skill !== value),
      }));
    }
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === "acceptTerms") {
        setFormData((prevData) => ({
          ...prevData,
          [name]: checked,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: checked
            ? [...prevData[name], value]
            : prevData[name].filter((item: string) => item !== value),
        }));
      }
    } else if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        cvType: value,
        ...(value === "online" ? { cvFile: null } : { cvLink: "" }),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "number" ? parseInt(value) : value,
        ...(name === "cvLink" && formData.cvType === "offline"
          ? { cvFile: null }
          : {}),
        ...(name === "cvFile" && formData.cvType === "online"
          ? { cvLink: "" }
          : {}),
      }));
    }
  };

  const handleProfilePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    _p0: string
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      setFormData((prevData) => ({
        ...prevData,
        profilePhoto: fileName,
      }));
    }
  };

  const handleCoverPhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    _p0: string
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      setFormData((prevData) => ({
        ...prevData,
        coverPhoto: fileName,
      }));
    }
  };

  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const [cvFileError, setCVFileError] = useState<string | null>(null);
  const [canSubmitForm, setCanSubmitForm] = useState<boolean>(true);

  const handleCVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const fileNameParts = selectedFile.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (!allowedExtensions.includes("." + fileExtension)) {
        setCVFileError("Only PDF, DOC, and DOCX files are allowed.");
        setCanSubmitForm(false);
      } else {
        setCVFileError(null);
        setCanSubmitForm(true);
        setFormData((prevData: any) => ({
          ...prevData,
          cvFile: selectedFile,
        }));
      }
    }
  };

  const handleProjectNameChange = (index: number, value: string) => {
    const updatedProjects = [...formData.previousProjects];
    updatedProjects[index].projectName = value;
    setFormData((prevData) => ({
      ...prevData,
      previousProjects: updatedProjects,
    }));
  };

  const handleProjectDescriptionChange = (index: number, value: string) => {
    const updatedProjects = [...formData.previousProjects];
    if (updatedProjects[index]) {
      updatedProjects[index].projectDescription = value;
      setFormData((prevData) => ({
        ...prevData,
        previousProjects: updatedProjects,
      }));
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required."),
    lastName: Yup.string().required("Last name is required."),
    education: Yup.string(),
    dob: Yup.string().required("Date of Birth is required."),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Email is required."),
    previousProjects: Yup.array().of(
      Yup.object().shape({
        projectName: Yup.string().required("Project Name is required."),
        projectDescription: Yup.string().required(
          "Project Description is required."
        ),
      })
    ),
    cvFile: Yup.mixed().nullable(),
    mobileNumber: Yup.string()
      .required("Mobile number is required.")
      .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number."),
    pinCode: Yup.string()
      .matches(/^\d{6}$/, "Pin code must be 6 digits")
      .nullable(),
    emergencyNumber: Yup.string(),
    yearsOfExperience: Yup.number()
      .required("Years of experience is required.")
      .min(0, "Years of experience must be at least 0.")
      .max(10, "Years of experience cannot exceed 10."),
    acceptTerms: Yup.bool().oneOf(
      [true],
      "You must accept the Terms and Conditions"
    ),
    skills: Yup.array().min(1, "At least one skill is required."),
    selfDescription: Yup.string()
      .required("Description is required.")
      .max(250, "Description must be at most 250 characters."),
    profilePhoto: Yup.mixed()
      .nullable()
      .test("fileSize", "Profile photo is required.", (value) => {
        return value && value.length > 0 && value[0].size > 0;
      }),
    coverPhoto: Yup.mixed(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    defaultValues: initialFormData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "previousProjects",
  });

  const onSubmit = async (data: FormData) => {
    if (!canSubmitForm) {
      return;
    }

    console.log(data);
    setFormData(initialFormData);
  };
  return (
    <form
      className="mx-auto p-3 border  rounded-lg w-[500px] bg-gray-200"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="firstName">
          First Name<span className="text-red-500">*</span>:
        </label>
        <input
          type="text"
          id="firstName"
          {...register("firstName")}
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="input-field border  w-full px-3 py-2 rounded-md"
        />

        {errors && errors.firstName && (
          <p className="text-red-500">{errors.firstName.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="lastName">
          Last Name<span className="text-red-500">*</span>:
        </label>
        <input
          type="text"
          id="lastName"
          {...register("lastName")}
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="input-field border  w-full px-3 py-2 rounded-md"
        />
        {errors && errors.lastName && (
          <p className="text-red-500">{errors.lastName.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="education">
          Education:
        </label>
        <input
          type="text"
          id="education"
          name="education"
          value={formData.education}
          onChange={handleChange}
          className="input-field border  w-full px-3 py-2 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="dob">
          Date of Birth<span className="text-red-500">*</span>:
        </label>
        <input
          type="date"
          id="dob"
          {...register("dob")}
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
          className="input-field border  w-full px-3 py-2 rounded-md"
        />
        {errors && errors.dob && (
          <p className="text-red-500">{errors.dob.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="email">
          Email<span className="text-red-500">*</span>:
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input-field border  w-full px-3 py-2 rounded-md"
        />
        {errors && errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Previous Projects:</label>
        {fields.map((item, index) => (
          <div key={item.id} className=" mb-2">
            <input
              type="text"
              {...register(`previousProjects.${index}.projectName`)}
              defaultValue={item.projectName}
              className="input-field border w-full px-3 py-2 rounded-md mr-2"
              placeholder="Project Name"
              onChange={(e) => handleProjectNameChange(index, e.target.value)}
            />
            {errors.previousProjects?.[index]?.projectName && (
              <p className="text-red-500">
                {errors.previousProjects[index].projectName.message}
              </p>
            )}
            <input
              type="text"
              {...register(`previousProjects.${index}.projectDescription`)}
              defaultValue={item.projectDescription}
              className="input-field border w-full px-3 py-2 rounded-md my-2"
              placeholder="Project Description"
              onChange={(e) =>
                handleProjectDescriptionChange(index, e.target.value)
              }
            />
            {errors.previousProjects?.[index]?.projectDescription && (
              <p className="text-red-500">
                {errors.previousProjects[index].projectDescription.message}
              </p>
            )}
            {index !== 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn-primary border border-black  bg-blue-950 text-white ml-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            append({ projectName: "", projectDescription: "" });
          }}
          className="btn-primary border border-black  bg-blue-950 text-white"
        >
          Add Project
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-bold">CV Type:</label>
        <div className="flex items-center mb-2 justify-center">
          <input
            type="radio"
            id="online"
            name="cvType"
            value="online"
            checked={formData.cvType === "online"}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="online" className="mr-4 ">
            Online
          </label>
          <input
            type="radio"
            id="offline"
            name="cvType"
            value="offline"
            checked={formData.cvType === "offline"}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="offline" className="mr-4 ">
            Offline
          </label>
        </div>
      </div>
      {formData.cvType === "online" ? (
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="cvLink">
            CV Website Link:
          </label>
          <input
            type="text"
            id="cvLink"
            {...register("cvLink")}
            name="cvLink"
            value={formData.cvLink}
            onChange={handleChange}
            className="input-field border  w-full px-3 py-2 rounded-md"
          />
          {errors && errors.cvLink && (
            <p className="text-red-500">{errors.cvLink.message}</p>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="cvFile">
            Upload CV File (PDF/DOC):
          </label>
          <input
            type="file"
            id="cvFile"
            {...register("cvFile")}
            onChange={handleCVFileChange}
            className="input-field border rounded-md"
          />
          {cvFileError && <p className="text-red-500">{cvFileError}</p>}
          {!canSubmitForm && cvFileError && (
            <p className="text-red-500">
              Form cannot be submitted with incorrect file format.
            </p>
          )}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-bold">Degree Type:</label>
        <div className="flex items-center mb-2 justify-center">
          <input
            type="checkbox"
            id="engineering"
            name="degreeTypes"
            value="Engineering"
            checked={formData.degreeTypes.includes("Engineering")}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="engineering" className="mr-4 ">
            Engineering
          </label>
          <input
            type="checkbox"
            id="bca"
            name="degreeTypes"
            value="bca"
            checked={formData.degreeTypes.includes("bca")}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="bca" className="mr-4 f">
            BCA
          </label>
          <input
            type="checkbox"
            id="mca"
            name="degreeTypes"
            value="mca"
            checked={formData.degreeTypes.includes("mca")}
            onChange={handleChange}
            className="mr-2 font-bold"
          />
          <label htmlFor="mca" className="mr-4 ">
            MCA
          </label>
          <input
            type="checkbox"
            id="other"
            name="degreeTypes"
            value="other"
            checked={formData.degreeTypes.includes("other")}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="other" className="mr-4 ">
            Other
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="address">
          Address:
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="input-field border  w-full px-3 py-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="mobileNumber">
          Mobile Number<span className="text-red-500">*</span>:
        </label>
        <input
          type="tel"
          id="mobileNumber"
          {...register("mobileNumber")}
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          pattern="[0-9]{10}"
          required
          className="input-field border  w-full px-3 py-2 rounded-md"
        />
        {errors && errors.mobileNumber && (
          <p className="text-red-500">{errors.mobileNumber.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="pinCode">
          Pin Code:
        </label>
        <input
          type="text"
          id="pinCode"
          {...register("pinCode")}
          name="pinCode"
          value={formData.pinCode}
          onChange={handleChange}
          pattern="[0-9]{6}"
          maxLength={6}
          className="input-field border "
        />
        {errors && errors.pinCode && (
          <p className="text-red-500">{errors.pinCode.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="emergencyNumber">
          Emergency Number:
        </label>
        <input
          type="text"
          id="emergencyNumber"
          {...register("emergencyNumber")}
          name="emergencyNumber"
          value={formData.emergencyNumber}
          onChange={handleChange}
          pattern="[0-9]{10}"
          maxLength={10}
          className="input-field border  w-full px-3 py-2 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="profilePhoto">
          Profile Photo<span className="text-red-500">*</span>:
        </label>
        <input
          type="file"
          id="profilePhoto"
          {...register("profilePhoto")}
          name="profilePhoto"
          onChange={(e) => handleProfilePhotoChange(e, "profilePhoto")}
          required
          className="input-field border "
        />
        {errors.profilePhoto && (
          <p className="text-red-500">{errors.profilePhoto.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="coverPhoto">
          Cover Photo:
        </label>
        <input
          type="file"
          id="coverPhoto"
          {...register("coverPhoto")}
          name="coverPhoto"
          onChange={(e) => handleCoverPhotoChange(e, "coverPhoto")}
          className="input-field border "
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="yearsOfExperience">
          Years of Experience<span className="text-red-500">*</span>:
        </label>
        <input
          type="number"
          id="yearsOfExperience"
          {...register("yearsOfExperience")}
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleChange}
          required
          min={0}
          max={10}
          className="input-field border "
        />
        {errors && errors.yearsOfExperience && (
          <p className="text-red-500">{errors.yearsOfExperience.message}</p>
        )}
      </div>

      {/* Existing form fields... */}

      <div className="mb-4">
        <label className="font-bold">Skills:</label>
        <div className="flex items-center mb-2 justify-center">
          <div className="mx-4">
            <input
              type="checkbox"
              value="JS"
              {...register("skills")}
              onChange={handleSkillChange}
              className="mr-2"
            />
            <label>Javascript</label>
          </div>
          <div className="mx-4">
            <input
              type="checkbox"
              value="Python"
              {...register("skills")}
              onChange={handleSkillChange}
              className="mr-2"
            />
            <label>Python</label>
          </div>
          <div className="mx-4">
            <input
              type="checkbox"
              value="PHP"
              {...register("skills")}
              onChange={handleSkillChange}
              className="mr-2"
            />
            <label>PHP</label>
          </div>
        </div>
        {errors.skills && (
          <p className="text-red-500">{errors.skills.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold" htmlFor="selfDescription">
          Description about yourself<span className="text-red-500">*</span>:
        </label>
        <textarea
          id="selfDescription"
          {...register("selfDescription")}
          name="selfDescription"
          value={formData.selfDescription}
          onChange={handleChange}
          required
          maxLength={250} // Limit the input length
          className={`className="input-field border  w-full px-3 py-2 rounded-md"${
            errors.selfDescription ? "border-red-500" : ""
          }`} // Add red border for errors
        />
        {errors.selfDescription && (
          <p className="text-red-500">{errors.selfDescription.message}</p>
        )}
      </div>
      <div className="mb-4 form-check">
        <input
          type="checkbox"
          id="acceptTerms"
          {...register("acceptTerms")}
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          required
          className="form-check-input mr-2"
        />
        <label htmlFor="acceptTerms " className="form-check-label font-bold">
          I agree to the Terms and Conditions
        </label>
        {errors.acceptTerms && (
          <div className="invalid-feedback text-red-500">
            {errors.acceptTerms.message}
          </div>
        )}
      </div>

      <div className="mb-4">
        <button
          type="submit"
          className="btn-primary border border-black  bg-blue-950 text-white"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default FormComponent;
