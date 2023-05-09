import AsyncStorage from '@react-native-async-storage/async-storage';

// for authentication persistence
export const SetCookie = async (userData) => {
try {
for (const [key, value] of Object.entries(userData)) {
await AsyncStorage.setItem(key, value.toString());
}
} catch (e) {
console.log(e);
}
};

export const DeleteCookie = async (fields) => {
try {
await AsyncStorage.multiRemove(fields);
} catch (e) {
console.log(e);
}
};

export const hasCookie = async () => {
const fields = ['accessToken', 'email', 'givenName', 'familyName', 'imageUrl', 'name', 'googleId'];
const obj = {
haslogin: false,
};
try {
const accessToken = await AsyncStorage.getItem('accessToken');
if (accessToken) {
obj.haslogin = true;
for (const field of fields) {
obj[field] = (await AsyncStorage.getItem(field)) || 'lorem ipsum';
}
}
} catch (e) {
console.log(e);
}
return obj;
};

// For saving the reload data for an hour
export const setReloadCookie = async () => {
try {
const currTime = new Date();
await AsyncStorage.setItem('lastReload', currTime.getTime().toString());
} catch (e) {
console.log(e);
}
};

export const hasReloadCookie = async () => {
try {
const lastReload = await AsyncStorage.getItem('lastReload');
if (lastReload) {
return {
present: true,
date: parseInt(lastReload),
};
}
} catch (e) {
console.log(e);
}
return {
present: false,
};
};