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
} from "@mui/material";
import { doI18n, getAndSetJson } from "pithekos-lib";

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
      <FormControl>
        <FormLabel id="book-create-options">
          {doI18n(
            "pages:core-contenthandler_text_translation:add_content",
            i18nRef.current,
          )}
        </FormLabel>
        {/* <RadioGroup
          row
          aria-labelledby="book-create-options"
          name="book-create-options-radio-group"
          value={contentOption}
          onChange={(event) => setContentOption(event.target.value)}
        >
          <FormControlLabel
            value="plan"
            disabled={planResources.length === 0}
            control={<Radio />}
            label={doI18n(
              "pages:core-contenthandler_text_translation:plan_content_radio",
              i18nRef.current,
            )}
          />
        </RadioGroup> */}
      </FormControl>
      {contentOption === "plan" && (
        <>
          <Typography sx={{ padding: 1 }}>
            {doI18n(
              "pages:core-contenthandler_text_translation:helper_template",
              i18nRef.current,
            )}
          </Typography>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              id="select-plan-label"
              required
              htmlFor="plan"
              sx={sx.inputLabel}
            >
              {doI18n(
                "pages:core-contenthandler_text_translation:select_plan",
                i18nRef.current,
              )}
            </InputLabel>
            <Select
              variant="outlined"
              required
              labelId="plan-label"
              name="plan"
              inputProps={{
                id: "bookCode",
              }}
              value={selectedPlan || ""}
              label={doI18n(
                "pages:core-contenthandler_text_translation:select_plan",
                i18nRef.current,
              )}
              onChange={(event) => {
                setSelectedPlan(event.target.value);
              }}
              sx={sx.select}
            >
              {Object.entries(metadataSummaries)
                .filter((r) => r[1].flavor === "x-translationplan")
                .map((r) => (
                  <MenuItem key={r[0]} value={r[0]} dense>
                    <ListMenuItem listItem={r[1].name} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
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
