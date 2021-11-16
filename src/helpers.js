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
* or uploading it to the EPD playground
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

/*
* Loads a Patient resource with random generated content from the Patient Generator
* API. Needs to be inside the BFH network to work. First call can take a few seconds,
* subsequent calls are faster.
* @returns           - a Promise that resolves to a Patient resource.
*/
export function getExamplePatientFromPatientGenerator() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                resolve(JSON.parse(this.response));
            }
        })

        xhr.open("GET", "http://patient-generator.i4mi.bfh.ch/patient/get");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.send();
    });
}

export const EPD_SPID_OID = 'urn:oid:2.16.756.5.30.1.127.3.10.3';
export const HOEHEWEG_OID = 'urn:oid:2.16.756.5.30.1.178.1.1';
export const KNOWN_IDS = [
    {
        local: 'PAT.7056.0189',
        spid: '761337615370560189'
    },
    {
        local: 'PAT.7053.6004',
        spid: '761337615370536004'
    },
    {
        local: 'PATIENT1',
        spid: 'DEMO'
    }
]