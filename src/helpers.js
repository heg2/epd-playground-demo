/*
* Get a patients ID for a given system, defined by the systems OID.
* @param system     - the OID of the system you want to get the ID from
* @param patient    - the Patient resource
* @returns           - the ID as a string, if found
*                   - '-' if no matching system is found
*/
export function getIdBySystemOID(system, patient) {
    const identifier = patient.identifier.find(identifier => identifier.system == system);
    return identifier
                ? identifier.value
                : '-';
}

/*
* Converts a file to the Base64 format, which is necessary
*or uploading it to the EPD playground
* @param file       - the file to convert
* @returns           - a Promise that resolves to a String with the file encoded
*                     in Base64 or rejects if conversion does not work.
*/
export function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        if (file) {
            // FileReader function for read the file.
            const fileReader = new FileReader();
            var base64;
            // Onload of file read the file content
            fileReader.onload = (e => resolve(e.target.result));
            // Convert data to base64
            fileReader.readAsDataURL(file);
        }
        else {
            return reject('No file.');
        }
    });
}