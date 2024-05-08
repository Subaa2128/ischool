export type INewAdmission = {
  staff: {
    checkbox: boolean;
    staffName: string;
  };
  admission: {
    applicationNo: string;
    admissionNo: string;
    emisNo: string;
    applicationReceivedBy: string;
    DateOfAdmission: string;
    AdmissionRequiredFor: string;
    academicYear: string;
    grade: string;
  };
  student: {
    nameInEnglish: string;
    nameInTamil: string;
    gender: string;
    dateOfBirth: string;
    dataOfBirthInWords: string;
    aadharCardNo: string;
    motherTongue: string;
    nationality: string;
    caste: string;
    bloodGroup: string;
    religion: string;
    community: string;
  };
  parent: {
    fatherDetails: {
      name: string;
      dateOfBirth: string;
      mobileNo: string;
      emailAddress: string;
      aadarNo: string;
      educationQalification: string;
      occupation: string;
      annualIncome: string;
    };
    motherDetails: {
      name: string;
      dateOfBirth: string;
      mobileNo: string;
      emailAddress: string;
      aadarNo: string;
      educationQalification: string;
      occupation: string;
      annualIncome: string;
    };
  };
  siblings: [
    {
      name: string;
      class: string;
      dateOfBirth: string;
      instituteName: string;
      academicYear: string;
      sibling: string;
    }
  ];
  previousStudy: {
    instituteName: string;
    duration: string;
    class: string;
    medium: string;
    matric: string;
    marks: string;
  };
  upload: {
    transferCertificate: string;
    studentPhoto: string;
    birthCertificate: string;
    tenthMarksheet: string;
  };
  id?: string;
};
