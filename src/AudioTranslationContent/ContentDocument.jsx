import { useState, useContext, useEffect } from "react";
import {
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Typography,
  TextField,
} from "@mui/material";
import { getAndSetJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import sx from "../pages/Selection.styles";
import ListMenuItem from "../pages/ListMenuItem";
import { i18nContext } from "pankosmia-rcl";

export default function ContentDocument({
  open,
  contentOption,
  setContentOption,
  selectedPlan,
  setSelectedPlan,
  segmentation,
  setSegmentation,
}) {
  const { i18nRef } = useContext(i18nContext);

  const [metadataSummaries, setMetadataSummaries] = useState({});
  const planResources = Object.entries(metadataSummaries)
    .filter((r) => r[1].flavor === "x-translationplan")
    .map((r) => r[1].name);

  useEffect(() => {
    if (open) {
      getAndSetJson({
        url: "/api/burrito/metadata/summaries",
        setter: setMetadataSummaries,
      }).then();
    }
  }, [open]);

  return (
    <>
      {contentOption === "plan" && (
        <>
          <Typography> {doI18n(
            "pages:core-contenthandler_audio_translation:add_content",
            i18nRef.current,
          )}</Typography>
          <TextField
            disabled={planResources.length === 0}
            label={doI18n(
              "pages:core-contenthandler_audio_translation:select_plan",
              i18nRef.current,
            )}
            variant="outlined"
            fullWidth
            sx={{ marginTop: 2 }}
            select
            helperText={doI18n(
              "pages:core-contenthandler_audio_translation:helper_text",
              i18nRef.current,
            )}
            onChange={(event) => {
              setSelectedPlan(event.target.value);
            }}
            value={selectedPlan || ""}

          >
            {Object.entries(metadataSummaries)
              .filter((r) => r[1].flavor === "x-translationplan")
              .map((r) => (
                <MenuItem key={r[0]} value={r[0]} dense>
                  <ListMenuItem listItem={r[1].name} />
                </MenuItem>
              ))}
          </TextField>
          {selectedPlan && (
            <FormControl sx={{ paddingTop: 1 }}>
              <FormLabel id="audio-segmentation-options">
                {doI18n(
                  "pages:core-contenthandler_audio_translation:segmentation_label",
                  i18nRef.current,
                )}
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="audio-segmentation-options"
                name="audio-segmentation-radio-group"
                value={segmentation}
                onChange={(event) => setSegmentation(event.target.value)}
              >
                <FormControlLabel
                  value="section"
                  control={<Radio />}
                  label={doI18n(
                    "pages:core-contenthandler_audio_translation:segmentation_section",
                    i18nRef.current,
                  )}
                />
                <FormControlLabel
                  value="paragraph"
                  control={<Radio />}
                  label={doI18n(
                    "pages:core-contenthandler_audio_translation:segmentation_paragraph",
                    i18nRef.current,
                  )}
                />
              </RadioGroup>
            </FormControl>
          )}
        </>
      )}
    </>
  );
}
