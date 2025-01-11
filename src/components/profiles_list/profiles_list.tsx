import "./profiles_list.css";
import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { initialProfiles } from "@data";
import { useLocalStorage } from "@hooks";

const shekelSign = "₪";
interface Loan {
  monthlyPayout: number;
  months: number;
}
const defaultLoan: Loan = {
  monthlyPayout: 4665.93, //prime + 1.5% (around 7.5% total interest)
  months: 36,
};
interface Profile {
  name: string;
  startingAmount: number;
  monthlyContribution: number;
  annualGrowthRate: number;
  totalYears: number;
  loan?: Loan;
  // You can add more properties as needed
}
const defaultProfile: Profile = {
  name: "My Profile",
  startingAmount: 600_000,
  monthlyContribution: 8000,
  annualGrowthRate: 0.05,
  totalYears: 20,
};

const ProfileList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useLocalStorage(
    "profiles",
    initialProfiles as Profile[]
  );
  const openModal = (profile: Profile) => {
    setCurrentProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProfile(null);
  };

  const handleSave = () => {
    if (currentProfile) {
      //do stuff
      debugger;
      setProfiles(profiles);
      closeModal();
    }
  };

  const handleDelete = () => {
    if (currentProfile) {
      //do stuff
      setProfiles(profiles);
      closeModal();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Profile,
    loanField?: keyof Loan
  ) => {
    if (currentProfile) {
      if (loanField) {
      }
      const updatedProfile = {
        ...currentProfile,
        ...(!(loanField && currentProfile.loan)
          ? {
              [field]: (e as any).floatValue
                ? (e as any).floatValue
                : e.target.value,
            }
          : {
              loan: {
                ...currentProfile.loan,
                [loanField]: (e as any).floatValue
                  ? (e as any).floatValue
                  : e.target.value,
              },
            }),
      };
      setCurrentProfile(updatedProfile);
    }
  };

  const toggleLoan = () => {
    if (currentProfile) {
      const updatedProfile = { ...currentProfile };
      if (updatedProfile.loan) {
        delete updatedProfile.loan;
      } else {
        updatedProfile.loan = defaultLoan;
      }
      setCurrentProfile(updatedProfile);
    }
  };

  return (
    <div className="profileListContainer">
      <h2>Profiles</h2>
      <ul className="profileList">
        {profiles.map((profile) => (
          <li className="profileListItem" key={profile.name}>
            <Button
              className="profileButton"
              onClick={() => openModal(profile)}
            >
              {profile.name}
            </Button>
          </li>
        ))}
      </ul>

      {/* Modal for editing the profile */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="edit-profile-modal"
        aria-describedby="modal-to-edit-profile-details"
      >
        <Box className="modalBox">
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            className="modalHeader"
          >
            Edit Profile:
            <span className="profileName">
              {currentProfile && currentProfile.name}
            </span>
          </Typography>
          {!!currentProfile && (
            <div className="modalInputs">
              <div>
                <TextField
                  label="Name"
                  fullWidth
                  value={currentProfile.name}
                  onChange={(e: any) => handleInputChange(e, "name")}
                  variant="standard"
                />
              </div>
              <div>
                <NumericFormat
                  value={currentProfile.startingAmount}
                  onValueChange={(e: any) =>
                    handleInputChange(e, "startingAmount")
                  }
                  customInput={TextField}
                  fullWidth
                  thousandSeparator
                  prefix={`${shekelSign} `}
                  variant="standard"
                  label="Starting Amount"
                />
              </div>
              <div>
                <NumericFormat
                  value={currentProfile.monthlyContribution}
                  onValueChange={(e: any) =>
                    handleInputChange(e, "monthlyContribution")
                  }
                  customInput={TextField}
                  fullWidth
                  thousandSeparator
                  prefix={`${shekelSign} `}
                  variant="standard"
                  label="Monthly Contribution"
                />
              </div>
              <div>
                <NumericFormat
                  value={currentProfile.annualGrowthRate}
                  onValueChange={(e: any) =>
                    handleInputChange(e, "annualGrowthRate")
                  }
                  customInput={TextField}
                  fullWidth
                  thousandSeparator
                  prefix="% "
                  variant="standard"
                  label="Annual Growth Rate (%)"
                />
              </div>
              <div>
                <NumericFormat
                  value={currentProfile.totalYears}
                  onValueChange={(e: any) => handleInputChange(e, "totalYears")}
                  customInput={TextField}
                  fullWidth
                  variant="standard"
                  label="Total Years"
                />
              </div>
              <div className="optional-loan-section">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!currentProfile.loan}
                      onChange={toggleLoan}
                    />
                  }
                  label="Enable Optional Loan"
                />

                {!!currentProfile.loan && (
                  <div className="loan-fields">
                    <NumericFormat
                      value={currentProfile.loan.monthlyPayout || ""}
                      onValueChange={(e: any) =>
                        handleInputChange(e, "loan", "monthlyPayout")
                      }
                      customInput={TextField}
                      fullWidth
                      thousandSeparator
                      prefix={`${shekelSign} `}
                      variant="standard"
                      label="Monthly Payout"
                    />
                    <NumericFormat
                      value={currentProfile.loan.months || ""}
                      onValueChange={(e: any) =>
                        handleInputChange(e, "loan", "months")
                      }
                      customInput={TextField}
                      fullWidth
                      variant="standard"
                      label="Months"
                    />
                  </div>
                )}
              </div>

              <div className="modalButtonContainer">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  className="saveButton"
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDelete}
                  className="deleteButton"
                >
                  Delete
                </Button>
                <Button
                  variant="text"
                  onClick={closeModal}
                  className="cancelButton"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ProfileList;
