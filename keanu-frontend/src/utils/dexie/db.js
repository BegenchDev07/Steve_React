import Dexie from 'dexie';

export const db = new Dexie('keanuDatabase');

// todo: may need to redesign the structure of the database
// https://dexie.org/docs/Version/Version.stores()#warning
// Never index properties containing images, movies or large (huge) strings.
db.version(1).stores({
    images: '&url'
})