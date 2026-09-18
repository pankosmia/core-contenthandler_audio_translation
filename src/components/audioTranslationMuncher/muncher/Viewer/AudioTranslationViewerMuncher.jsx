import { useState, useContext } from "react";
import { Box, Stack } from "@mui/material";
import { doI18n } from "pankosmia-lib/i18n";

// function AudioViewer({ metadata, bookCode, chapter }) {
//   const overPaddedChapter = `000${chapter}`;
//   const paddedChapter = overPaddedChapter.substring(
//     overPaddedChapter.length - 3,
//   );
//   console.log("paddedChapter", paddedChapter);
//   return (
//     <Stack>
//       <audio
//         controls
//         src={`/api/burrito/ingredient/bytes/${metadata.local_path}?ipath=${bookCode}/${bookCode}_${paddedChapter}.mp3`}
//       ></audio>
//     </Stack>
//   );
// }
export default function AudioTranslationViewerMuncher({ metadata, systemBcv, debugRef, i18nRef }) {
  const [ingredient, setIngredient] = useState([]);
  const [verseNotes, setVerseNotes] = useState([]);
  const overPaddedChapter = `000${systemBcv.chapterNum}`;
  const paddedChapter = overPaddedChapter.substring(
    overPaddedChapter.length - 3,
  );
  console.log("paddedChapter", paddedChapter);

  return (
    <Box>
      <h5>{`${metadata.name} (${systemBcv.bookCode} ${systemBcv.chapterNum}:${systemBcv.verseNum})`}</h5>
      <h6>{doI18n("munchers:bcv_audio_viewer:title", i18nRef.current)}</h6>
      <Stack>
        <audio
          controls
          src={`/api/burrito/ingredient/bytes/${metadata.local_path}?ipath=${systemBcv.bookCode}/${systemBcv.bookCode}_${paddedChapter}.mp3`}
        ></audio>
      </Stack>

    </Box>
  );
}

