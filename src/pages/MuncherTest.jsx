import { Box } from "@mui/material";
import {
  currentProjectContext,
  debugContext,
  i18nContext,
  bcvContext,
  Header
} from "pankosmia-rcl";
import { useContext, useState, useEffect } from "react";
import { getJson } from "pankosmia-lib/http";
import { WrapperNav } from "../components/audioTranslationMuncher/wrapperMuncher/WrapperNav";
import { Padding } from "@mui/icons-material";
import AudioTranslationEditorMuncher from "../components/audioTranslationMuncher/muncher/Editor/AudioTranslationEditorMuncher";
import AudioTranslationViewerMuncher from "../components/audioTranslationMuncher/muncher/Viewer/AudioTranslationViewerMuncher";

export function MuncherTest() {
  const { currentProjectRef } = useContext(currentProjectContext);
  const { debugRef } = useContext(debugContext);
  const { i18nRef } = useContext(i18nContext);
  const [currentBurrito, setCurrentBurrito] = useState(null);
  const [modified, setModified] = useState(false);
  const { systemBcv } = useContext(bcvContext);
  useEffect(() => {
    async function getSummary() {
      if (currentProjectRef.current) {
        const projectPath = `${currentProjectRef.current.source}/${currentProjectRef.current.organization}/${currentProjectRef.current.project}`;
        const fullMetadataResponse = await getJson(
          `/api/burrito/metadata/summary/${projectPath}`,
        );
        if (fullMetadataResponse.ok) {
          const entry = fullMetadataResponse.json;
          setCurrentBurrito([projectPath, entry]);
        } else {
          enqueueSnackbar(
            `${doI18n("pages:core-contenthandler_audio_translation:error", i18nRef.current)}: ${fullMetadataResponse.status}`,
            { variant: "error" },
          );
        }
      }
    }

    getSummary();
  }, [currentProjectRef.current]);

  const metadata = currentBurrito && {
    local_path: currentBurrito[0],
    ...currentBurrito[1],
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box>
        <Header
          titleKey={"pages:core-contenthandler-audio_translation:titleMuncherTest"}
          currentId="content"
          requireNet={false}
        />
      </Box>
      <Box sx={{ paddingLeft: 2, paddingTop: 10, flexShrink: 0 }}>
        <WrapperNav flavor={"audioTranslation"} />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {metadata && (
          <Box sx={{ flex: 1, margin: 2 }}>
            <AudioTranslationViewerMuncher
              metadata={metadata}
              debugRef={debugRef}
              i18nRef={i18nRef}
              systemBcv={systemBcv}
            />
          </Box>
        )}
        {metadata && (
          <Box sx={{ flex: 1, margin: 2 }}>
            <AudioTranslationEditorMuncher
              metadata={metadata}
              debugRef={debugRef}
              i18nRef={i18nRef}
              currentBurrito={currentBurrito}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
