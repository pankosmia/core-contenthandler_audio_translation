import { useState, useContext, useEffect, useRef } from "react";
import { Box, DialogContent } from "@mui/material";
import { postJson, doI18n, getAndSetJson, getJson } from "pithekos-lib";
import {
    PanDialog,
    i18nContext,
    debugContext,
    Header,
    PanStepperPicker,
} from "pankosmia-rcl";
import { useSearchParams } from "react-router-dom";
import ContentDocument from "../AudioTranslationContent/ContentDocument";
import LanguagePicker from "../AudioTranslationContent/LanguagePicker";
import NameDocument from "../AudioTranslationContent/NameDocument";
import ErrorDialog from "../AudioTranslationContent/ErrorDialog";




export default function NewAudioTranslationContent() {
    const { i18nRef } = useContext(i18nContext);
    const hash = window.location.hash;
    const query = hash.includes("?") ? hash.split("?") : "";
    const typePageQuery = new URLSearchParams(query[1]);
    const returnType = typePageQuery.get("returnTypePage");
    const [searchParams] = useSearchParams();
    const uuid = searchParams.get("uuid");
    const [contentOption, setContentOption] = useState("plan");
    const [open, setOpen] = useState(true);
    const [versification, setVersification] = useState("eng");
    const [selectedPlan, setSelectedPlan] = useState("");
    const [segmentation, setSegmentation] = useState("section");
    const [currentLanguage, setCurrentLanguage] = useState({
        language_code: "",
        language_name: "",
    });
    const [languageIsValid, setLanguageIsValid] = useState(true);

    const [contentType, setContentType] = useState("audio_translation");
    const [repoExists, setRepoExists] = useState(false);
    const [contentName, setContentName] = useState("");
    const [contentAbbr, setContentAbbr] = useState("");
    const [errorAbbreviation, setErrorAbbreviation] = useState(false);
    const [localRepos, setLocalRepos] = useState([]);
    const debugRef = useRef(debugContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const steps = [
        `${doI18n("pages:core-contenthandler_audio_translation:content_section", i18nRef.current)}`,
        `${doI18n("pages:core-contenthandler_audio_translation:language", i18nRef.current)}`,
        `${doI18n("pages:core-contenthandler_audio_translation:name_section", i18nRef.current)}`,
    ];


    const renderStepContent = (step) => {
        switch (step) {
            case 2:
                return (
                    // <>Name Document</>
                    <NameDocument
                        contentType={contentType}
                        setContentType={setContentType}
                        repoExists={repoExists}
                        setRepoExists={setRepoExists}
                        contentName={contentName}
                        setContentName={setContentName}
                        contentAbbr={contentAbbr}
                        setContentAbbr={setContentAbbr}
                        errorAbbreviation={errorAbbreviation}
                        setErrorAbbreviation={setErrorAbbreviation}
                        localRepos={localRepos}
                    />
                );
            case 1:
                return (
                    // <>Language Picker</>
                    <LanguagePicker
                        currentLanguage={currentLanguage}
                        setCurrentLanguage={setCurrentLanguage}
                        setIsValid={setLanguageIsValid}
                    />
                );
            case 0:
                return (
                    // <>Content Document</>
                    <ContentDocument
                        open={open}
                        contentOption={contentOption}
                        setContentOption={setContentOption}
                        selectedPlan={selectedPlan}
                        setSelectedPlan={setSelectedPlan}
                        segmentation={segmentation}
                        setSegmentation={setSegmentation}
                    />
                );
            default:
                return null;
        }
    };

    const isStepValid = (step) => {
        switch (step) {
            case 2:
                return (
                    contentName.trim().length > 0 &&
                    contentAbbr.trim().length > 0 &&
                    contentType.trim().length > 0 &&
                    errorAbbreviation === false &&
                    repoExists === false
                );

            case 1:
                return (
                    currentLanguage?.language_code?.trim().length > 0 &&
                    currentLanguage?.language_name?.trim().length > 0 &&
                    languageIsValid === true
                );
            case 0:
                if (contentOption === "plan") {
                    return Boolean(selectedPlan) && Boolean(segmentation);
                }
            default:
                return true;
        }
    };

    const handleClose = () => {
        setOpen(false);
        if (returnType === "dashboard") {
            setTimeout(() => {
                window.location.href = "/clients/main";
            });
        } else {
            setTimeout(() => {
                window.location.href = "/clients/content";
            });
        }
    };

    useEffect(() => {
        if (open) {
            getAndSetJson({
                url: "/api/git/list-local-repos",
                setter: setLocalRepos,
            }).then();
        }
    }, [open]);

    const handleCreate = async () => {
        // versification for plan comes from plan
        let planJson = null;
        let submittedVersification = versification;

        if (contentOption === "plan" && selectedPlan) {
            const planResponse = await getJson(
                `/api/burrito/ingredient/raw/${selectedPlan}?ipath=plan.json`,
                debugRef.current,
            );
            if (planResponse.ok) {
                planJson = planResponse.json;
                submittedVersification = planJson.versification;
            } else {
                setErrorMessage(
                    `${doI18n("pages:core-contenthandler_text_translation:content_creation_error", i18nRef.current)}: ${planResponse.status}`,
                );
                setErrorDialogOpen(true);
                return;
            }
        }

        // Make repo (empty for plans)
        const payload = {
            content_name: contentName,
            content_abbr: contentAbbr,
            content_type: contentType,
            content_language_code: currentLanguage.language_code,
            content_language_name: currentLanguage.language_name,
            versification: submittedVersification,
        };

        const response = await postJson(
            "/api/git/new-audio-translation",
            JSON.stringify(payload),
            debugRef.current,
        );
        if (!response.ok) {
            setErrorMessage(
                `${doI18n("pages:core-contenthandler_audio_translation:audio_translation_creation_error", i18nRef.current)}: ${response.status
                }`,
            );
            setErrorDialogOpen(true);
            return;
        }
        const repoPath =
            response.json?.repo_path ?? `_local_/_local_/${contentAbbr}`;
        // We do NOT generate any book here. As with text translation, there is
        // no content before the first recording. Instead we store the plan in
        // the repo (stamped with the chosen segmentation) so that books can be
        // created on demand later from `/newBook` — the audio has no structure
        // to re-derive the plan from once recorded.
        if (planJson) {
            const storedPlan = { ...planJson, audioSegmentation: segmentation };
            const storePlanResponse = await postJson(
                `/api/burrito/ingredient/raw/${repoPath}?ipath=plan.json&update_ingredients`,
                JSON.stringify({ payload: JSON.stringify(storedPlan, null, 2) }),
            );
            if (!storePlanResponse.ok) {
                setErrorMessage(
                    `${doI18n("pages:core-contenthandler_audio_translation:audio_translation_creation_error", i18nRef.current)}: ${storePlanResponse.status}`,
                );
                setErrorDialogOpen(true);
                return;
            }
        }
        await handleClose();
    };



    return (
        <Box>
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: -1,
                    backgroundImage:
                        'url("/api/app-resources/pages/content/background_blur.png")',
                    backgroundRepeat: "no-repeat",
                }}
            />
            <Header
                titleKey={
                    returnType === "dashboard"
                        ? "pages:core-dashboard:title"
                        : "pages:content:title"
                }
                currentId="content"
                requireNet={false}
            />
            <PanDialog
                titleLabel={doI18n(
                    "pages:core-contenthandler_audio_translation:create_content_audio_translation",
                    i18nRef.current,
                )}
                isOpen={open}
                closeFn={() => handleClose()}
            >
                <DialogContent>
                    <PanStepperPicker
                        steps={steps}
                        renderStepContent={renderStepContent}
                        isStepValid={isStepValid}
                        handleCreate={handleCreate}
                        handleClose={handleClose}
                        requiredFieldsLabel
                    />
                </DialogContent>
            </PanDialog>
            {/* Error Dialog */}
            <ErrorDialog
            setErrorDialogOpen={setErrorDialogOpen}
            handleClose={handleClose}
            errorDialogOpen={errorDialogOpen}
            errorMessage={errorMessage}
          />
        </Box>
    );
}
