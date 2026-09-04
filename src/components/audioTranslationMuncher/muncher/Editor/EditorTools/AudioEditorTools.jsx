import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { doI18n } from "pankosmia-lib/i18n";

import LayoutIcon from "./layouts/LayoutIcon";
import AudioCompileIcon from "./AudioCompileIcon";
import GeneratedAtLabel from "./GeneratedAtLabel";
import AudioNavigator from "./AudioNavigator";

// Top toolbar for the audio translation editor, modelled on OBSEditorTools /
// TextTranslation EditorTools: a fixed bar with the navigator centred and the
// layout-edit button on the right.
function AudioEditorTools({ nav, compileAudio, generatedAt, i18nRef, debugRef }) {
  const navigate = useNavigate();

  const compileAudioHandler = async () => {
    try {
      // compileAudio renvoie false lorsqu'il court-circuite pour ouvrir le
      // modal FFmpeg : rien n'a été compilé, on n'affiche pas de succès.
      const compiled = await compileAudio();
      if (compiled === false) {
        return;
      }
      enqueueSnackbar(
        doI18n(
          "pages:core-local-workspace:audio_compiled",
          i18nRef.current,
          debugRef.current,
        ),
        { variant: "success" },
      );
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "40px",
        left: 0,
        right: 0,
        display: "flex",
        padding: 2,
      }}
    >
      <Grid
        container
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Grid sx={{ display: "flex", alignItems: "center", flex: 1 }} gap={1}>
          <Tooltip
            title={doI18n(
              "pages:core-local-workspace:button_generate_audio",
              i18nRef.current,
              debugRef.current,
            )}
          >
            <span>
              <IconButton
                disabled={!compileAudio}
                onClick={compileAudioHandler}
              >
                <AudioCompileIcon />
              </IconButton>
            </span>
          </Tooltip>
          <GeneratedAtLabel date={generatedAt} i18nRef={i18nRef} debugRef={debugRef} />
        </Grid>

        <Grid sx={{ display: "flex", alignItems: "center", flex: 1 }} gap={1}>
          <AudioNavigator {...nav} i18nRef={i18nRef}  />
        </Grid>

        <Grid
          gap={1}
          sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
        >
          <Tooltip
            title={doI18n(
              "pages:core-local-workspace:button_edit_layout",
              i18nRef.current,
              debugRef.current,
            )}
          >
            <IconButton
              sx={{ transition: "color 0.3s ease" }}
              /* enables redirection based on the page */
              onClick={() =>
                navigate({
                  pathname: "/",
                  search: "return-page=workspace",
                })
              }
            >
              <LayoutIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AudioEditorTools;
