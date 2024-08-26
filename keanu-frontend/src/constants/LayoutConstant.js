export const SD_LAYOUT = {
    single:1,
    double:2,
    editable: 4,
    disEditable: 8,
    noSideBar: 16,
    hasSideBar: 32,
}

SD_LAYOUT.SD_REQ_NALLOW = SD_LAYOUT.single | SD_LAYOUT.disEditable | SD_LAYOUT.noSideBar;

SD_LAYOUT.SD_RES_NALLOW = SD_LAYOUT.single | SD_LAYOUT.editable | SD_LAYOUT.noSideBar;
SD_LAYOUT.SD_RES_WIDE = SD_LAYOUT.double | SD_LAYOUT.editable | SD_LAYOUT.noSideBar;

SD_LAYOUT.SD_PREVIEW_NALLOW = SD_LAYOUT.single | SD_LAYOUT.disEditable | SD_LAYOUT.hasSideBar;

export const INFER_PROGRESS_LAYOUT = {
    demo: 1,
    inbox: 2
}