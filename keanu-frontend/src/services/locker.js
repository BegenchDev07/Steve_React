const DEFAULT_RETRY_DELAY = 50;

const __locker_waitList = {};
export const $check = (condition,onSuccess,retryDelay= DEFAULT_RETRY_DELAY)=> new Promise(resolve=>{
    if(condition()){
        onSuccess();
        return resolve();
    }else
        setTimeout(async _=>await $check(condition, onSuccess, retryDelay),retryDelay);
});




function acquireLockByQueue(lockName){
    __locker_waitList[lockName][0]();
}
function releaseLockByQueue(lockName){
    __locker_waitList[lockName].shift();

    if(__locker_waitList[lockName].length === 0)
        delete __locker_waitList[lockName];
    else
        acquireLockByQueue(lockName);
}


export function lock (lockName) {
    return new Promise(resolve => {
        if(__locker_waitList[lockName] == undefined)
            __locker_waitList[lockName] = [];
        if (!lockName)
            throw new Error("You must specify a lock string. It is on the redis key `lock.[string]` that the lock is acquired.");

        const release = _=>{
            if(__locker_waitList[lockName] === undefined)
                throw new Error("Cannot release twice");

            releaseLockByQueue(lockName);
        };

        __locker_waitList[lockName].push(_=>  resolve(release));
        acquireLockByQueue(lockName);
    });
}

export const cancel = (lockName)=> new Promise(async resolve=>

    $check(_=>__locker_waitList[lockName] === undefined || __locker_waitList[lockName].length === 0,
        _=> {
            delete __locker_waitList[lockName];
            return resolve();
        })
);

export const checkValid = (lockName)=> __locker_waitList[lockName] === undefined || __locker_waitList[lockName].length === 0

export const LocalLocker=_=>{return {lock, cancel}};
export default {lock,cancel,checkValid, LocalLocker};
