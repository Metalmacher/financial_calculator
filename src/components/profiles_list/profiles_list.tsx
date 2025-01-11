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
import { MuiColorInput } from "mui-color-input";
import { getBackground } from "@utils";
import { Loan, Profile, shekelSign } from "@interfaces";

const defaultLoan: Loan = {
  monthlyPayout: 4665.93, //prime + 1.5% (around 7.5% total interest)
  months: 36,
};
const defaultProfile: Profile = {
  name: "My Profile",
  startingAmount: 600_000,
  monthlyContribution: 8000,
  color: "#000000",
};
interface ProfileListProps {
  callback: (profiles: Profile[]) => void;
  profiles: Profile[];
}

export const ProfileList: React.FC<ProfileListProps> = ({
  profiles,
  callback,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [currentProfileIndex, setCurrentProfileIndex] = useState<number | null>(
    null
  );

  const openModal = (profile: Profile, profileIndex: number | null) => {
    setCurrentProfile(profile);
    setCurrentProfileIndex(profileIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProfile(null);
    setCurrentProfileIndex(null);
  };

  const handleNewProfile = () => {
    openModal({ ...defaultProfile }, null);
  };
  const handleSave = () => {
    if (currentProfile) {
      //do stuff
      if (currentProfileIndex !== null) {
        profiles[currentProfileIndex] = currentProfile;
      } else {
        profiles.push(currentProfile);
      }
      const newProfiles = [...profiles];
      callback(newProfiles);
      closeModal();
    }
  };

  const handleDelete = () => {
    if (currentProfileIndex !== null) {
      //do stuff
      profiles.splice(currentProfileIndex, 1);
      const newProfiles = [...profiles];
      callback(newProfiles);
    }
    closeModal();
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
                : e.target?.value != null
                ? e.target?.value
                : e,
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
      <Box className="profileMain">
        <Box className="profileListBox">
          <h2>Profiles</h2>
          <ul className="profileList">
            {profiles.map((profile, index) => (
              <li className="profileListItem" key={profile.name}>
                <Button
                  className="profileButton"
                  onClick={() => openModal(profile, index)}
                  sx={{
                    backgroundColor: profile.color,
                    color: getBackground(profile.color),
                  }}
                >
                  {profile.name}
                </Button>
              </li>
            ))}
          </ul>
          <hr />
          <Box>
            <Button
              variant="contained"
              color="success"
              onClick={handleNewProfile}
            >
              Create new profile
            </Button>
          </Box>
        </Box>
      </Box>

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
                <FormControlLabel
                  className="profileColor"
                  labelPlacement="top"
                  control={
                    <MuiColorInput
                      name="profileColor"
                      format="hex"
                      value={currentProfile.color}
                      onChange={(e: any) => handleInputChange(e, "color")}
                    />
                  }
                  label="Graph color"
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
                {currentProfileIndex !== null && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleDelete}
                    className="deleteButton"
                  >
                    Delete
                  </Button>
                )}
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
