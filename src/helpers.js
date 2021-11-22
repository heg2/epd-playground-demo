export const EPR_SPID_OID = 'urn:oid:2.16.756.5.30.1.127.3.10.3';
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
];

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

/*
* Checks if a http server is responding or not.
* Based on: https://stackoverflow.com/questions/4282151/is-it-possible-to-ping-a-server-from-javascript
* @param server     - the url of the server to check
* @param timeout    - milliseconds to wait for the server to respond
* @returns          - A promise that resolves to true if the server responds
*                     within the given timeout timespan (even with an error
*                     message), and resolves to false, if the server does not respond (timeout).
*                     The promise is rejected when the server param is not a valid url.
*/
export function checkAvailability(server, timeout) {
    return new Promise((resolve, reject) => {
        // validate correct url
        try {
            if (!new URL(server).protocol.includes('http')) {
                return reject('"' + server + '" is not a valid URL.');
            }
        } catch (e) {
            console.log(e);
            return reject('"' + server + '" is not a valid URL.');
        }

        // if the url is fine, let's ping
        let ping = new Image();
        ping.onload = () => resolve(true);
        // an error is also a response, so: resolve
        ping.onerror = () => resolve(true);

        ping.src = server;
        // set timeout so were not stuck trying forever
        setTimeout(() => resolve(false), timeout);
    });
}

/*
* Generates a EPR-SPID with checksum for a 9 digit long given id.
* @param idea       - the ID from which the EPR-SPID should be generated, as a string. Must have length of 9.
* @returns          - a EPR-SPID as a string.
*/
export function generateEprSpid(id) {
    if (id.length !== 9) {
        throw new Error('ID must be exactly 9 digits. (is: ' + id + ')');
    }
    const COUNTRY_CODE_CH = '76';
    const PARTICIPANT_CODE_BAG = '13376';
    const PURPOSE_CODE_EPD = '1';
    let spid = COUNTRY_CODE_CH + PARTICIPANT_CODE_BAG + PURPOSE_CODE_EPD + id;

    // calculate checksum according to
    // https://www.fedlex.admin.ch/eli/cc/2017/205/de#annex_1
    let sum = 0;
    for (var i = spid.length - 1; i >= 0; i--) {
        sum += (i % 2 === 0)
                ? parseInt(spid[i]) * 3
                : parseInt(spid[i])
    }
    spid += (10 - (sum % 10));
    return spid;
}
