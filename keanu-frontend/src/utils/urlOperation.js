export const isDraft = uuid=>/(.+)-DRAFT$/.test(uuid);

export const clearDraft = uuid=>uuid.split('-DRAFT')[0];

export const appendDraft = uuid => uuid.split('-DRAFT').length === 2 ? uuid : `${uuid}-DRAFT`;