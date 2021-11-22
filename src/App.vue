<template>
    <div id="app">
        <h1>EPD Playground Demo App</h1>
        <p>Das ist eine simple Demo, wie mithilfe von JsOnFhir über den Mobile Access Gateway auf den EPD Playground zugegriffen werden kann.</p>
        <p v-if="patientGeneratorAvailable !== false">
            Mit dem Patient Generator können Beispiel-Patient*innen erstellt werden. Dazu muss man sich im BFH-Netz befinden (oder per VPN eingewählt sein). Kudos an Robin Glauser für das Erstellen des Patient Generators.
        </p>
        <p v-if="patientGeneratorAvailable === false" class="patgen-not-available">
            <b>Der Patient Generator ist nicht erreichbar.</b><br />
            Um mit dem Patient Generator neue Beispiel-Patient*innen erstellen zu können, musst du dich im Netz der BFH befinden (vor Ort oder per VPN).<br>
            Ohne Patient Generator hast du die Möglichkeit, unten über eine EPR-SPID einen vorhandenen Datensatz zu laden.
        </p>
        <patient-card v-if="patient.name" :patient="patient" :onRefresh="() => this.refreshPatient()" />


        <h2>Folgende Aktionen sind verfügbar: </h2>
        <ul>
            <li v-if="patient.name">
                <h3>Beispielpatient*in schreiben</h3>
                <p>
                    Schreibt die oben aufgeführten Patientendaten auf den EPD Playground. <br />
                    Merke dir die IDs, damit du den Patient später wieder laden kannst.
                </p>
                <button @click="createPatient" :disabled="!patientIsNew">ausführen</button>
                <span v-if="!patientIsNew" class="isnotnew-tip">Diese*r Patient*in ist bereits auf dem EPD Playground gespeichert.</span>
            </li>
            <li>
                <h3>EPR-SPID laden</h3>
                <p>
                    Lädt die EPR-SPID vom EPD Playground, anhand einer bekannten lokalen PID (der Klinik Höheweg).
                </p>
                <p>
                    <small>Dies kann die ID eines neu angelegten Patienten sein, oder eine der folgenden:
                        <span v-for="id in knownIds" @click="() => this.localId=id.local">{{id.local}}, </span>
                        ...
                    </small>
                </p>

                <label for="id-input">Lokale ID:</label>
                <input type="text" v-model="localId" id="id-input"/>
                <p class="result">EPR-SPID: <small>{{ eprSpid }}</small></p>
                <button @click="searchSpid(localId)">ausführen</button>
            </li>
            <li>
                <h3>Patient*in laden</h3>
                <p>
                    Lädt Patienten-Stammdaten zur angegebenen EPR-SPID aus dem EPD Playground und setzt die geladenen Daten als Demo-Patient*in.
                </p>
                <p>
                    <small>Beispiele für EPR-SPID:
                        <span v-for="id in knownIds" @click="() => this.eprSpid=id.spid">{{id.spid}}, </span>
                        ...
                    </small>
                </p>
                <label for="spid-input">EPR-SPID:</label>
                <input type="text" v-model="eprSpid" id="spid-input"/>
                <button @click="loadPatientBySPID(eprSpid)">ausführen</button>
            </li>
            <li>
                <h3>Dokument hochladen</h3>
                <p>
                    In Demo noch nicht implementiert.
                </p>

                <input type="file" ref="documentInput" />
                <button @click="uploadDocument">ausführen</button>
            </li>
            <li>
                <h3>Dokumente suchen</h3>
                <p>
                    Lädt eine Liste der Dokumente, die für eine Person mit gegebener EPR-SPID im EPD Playground vorhanden sind.
                </p>
                <p>
                    <small>Beispiele für EPR-SPID:
                        <span v-for="id in knownIds" @click="() => this.eprSpid=id.spid">{{id.spid}}, </span>
                        ...
                    </small>
                </p>
                <label for="spid-input2">EPR-SPID:</label>
                <input type="text" v-model="eprSpid" id="spid-input2"/>
                <button @click="searchDocumentsByeprSpid(this.eprSpid)">ausführen</button>
            </li>
        </ul>
        <p>Tipp: Aktiviere die Browser-Konsole für mehr Informationen.<br />(auf Mac: [alt] [cmd] [I], auf Windows: [Ctrl] [Shift] [I])</p>
    </div>


    <!--p id="display" v-if="display!= ''">
    {{ display }}<br /><br />
    See browser console for details.
</p-->

</template>

<script>
// node modules
import { v4 as uuid } from 'uuid';

// Vue Components
import PatientCard from './PatientCard.vue';

// global constants and helper functions
import { getIdBySystemOID, convertToBase64, getExamplePatientFromPatientGenerator, checkAvailability, generateEprSpid,
         EPR_SPID_OID, HOEHEWEG_OID, KNOWN_IDS } from './helpers.js';

// JSON templates
import createPatientMessage from '../static/createMessageTemplate.json';
import organizationHoeheweg from '../static/organizationHoeheweg.json';
import createDocumentBundle from '../static/createDocumentTemplate.json';

export default {
    name: 'app',
    components: {
        'patient-card': PatientCard
    },
    data(){
        return {
            patient: {},
            isRefreshingPatient: false,
            localId: 'PAT.7056.0189',
            patientIsNew: false,
            eprSpid: '',
            patientGeneratorAvailable: undefined,
            documents: undefined,
            knownIds: KNOWN_IDS
        }
    },

    methods: {
        createPatient() {
            // for creating a patient, we need to build a FHIR message resource

            // first, add the Klinik Höheweg Organization as a contained resource
            // Patient resource:
            this.patient.contained = [ organizationHoeheweg ];
            // and refer to it:
            this.patient.managingOrganization = { reference: '#' + organizationHoeheweg.id };

            // the Patient resource also needs an id for the bundle (this is
            // just for use inside the Bundle and does not show up in EPD Playground)
            this.patient.id = Math.ceil(Math.random() * 10000).toString();

            // now, the patient resource is complete and can be added to the
            // Message Bundle template
            createPatientMessage.entry.push({
                fullUrl: 'http://example.com/fhir/Patient/' + this.patient.id,
                request: {
                    method: 'POST'
                },
                resource: this.patient
            });

            // link  the Patient resource in the Message Header (which must be
            // always the first entry of the Message Bundle)
            createPatientMessage.entry[0].focus = [ { reference: 'Patient/' + this.patient.id } ];

            // now, we are ready to go and can send the Bundle to the Mobile Access Gateway
            console.log(createPatientMessage)
            this.$fhir.performOperation('process-message', createPatientMessage)
            .then(result => {
                console.log('Create Patient server response:',result);
                // set flag to false to prevent creating the same patient again
                this.patientIsNew = false;
                this.localId = getIdBySystemOID(HOEHEWEG_OID, this.patient);
                this.eprSpid = getIdBySystemOID(EPR_SPID_OID, this.patient);
            })
            .catch(err => {
                this.display = 'Oops. Something went wrong.';
                console.log(err);
            });
        },

        searchSpid(id) {
            // We search for the patients EPR-SPID as registered on the EPD Playground
            // by using the local ID (which is also registered in the EPD Playground)

            const SEARCH_PARAMS = {
                // sourceIdentifier is the ID we know (local ID from Klinik Höheweg)
                sourceIdentifier: HOEHEWEG_OID + '|' + id,
                // target system is the ID we want
                targetSystem:  EPR_SPID_OID
            }
            this.$fhir.performOperation('ihe-pix', {}, 'GET', SEARCH_PARAMS, 'Patient')
            .then((result) => {
                console.log('Server answer', result);
                if (result.body && result.body.parameter && result.body.parameter[0].valueIdentifier) {
                    this.eprSpid = result.body.parameter[0].valueIdentifier.value;
                } else {
                    this.eprSpid = 'nicht gefunden';
                }
            })
            .catch(err => {
                this.eprSpid = 'nicht gefunden';
                console.log(err);
            });
        },

        loadPatientBySPID(spid) {
            const SEARCH_PARAMS = {
                identifier: EPR_SPID_OID + '|' + spid
            }
            this.$fhir.search('Patient', SEARCH_PARAMS)
            .then((result) => {
                if (result.entry && result.entry[0] && result.entry[0].resource) {
                    this.patient = result.entry[0].resource;
                    this.localId = getIdBySystemOID(HOEHEWEG_OID, this.patient)
                    this.patientIsNew = false;
                }
                console.log('Search result', result)
            })
            .catch(err => {
                this.display = 'Oops. Something went wrong.';
                console.log(err);
            });
        },

        uploadDocument() {
            const inputFile = this.$refs.documentInput.files[0];
            convertToBase64(inputFile)
            .then(base64 => {

                this.patient.id = 'pat1';
                const fileResourceUrl = 'urn:uuid:' + uuid();
                const submissionSetUrl = 'urn:uuid:' + uuid();
                const documentReferenceUrl = 'urn:uuid:' + uuid();
                const OID_URN = 'urn:oid:1.1.1.99.1'

                const fileResource = {
                    resourceType: 'Binary',
                    contentType: inputFile.type,
                    data: base64
                };

                const submissionSetResource = {
                    resourceType: 'List',
                    id: submissionSetUrl,
                    meta: {
                        profile: [
                            'http://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.Comprehensive.SubmissionSet'
                        ]
                    },
                    extension: [
                        {
                            url: 'http://profiles.ihe.net/ITI/MHD/StructureDefinition/ihe-designationType',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://snomed.info/sct',
                                        code: '71388002',
                                        display: 'Procedure (procedure)'
                                    }
                                ]
                            }
                        },
                        {
                            url: 'http://profiles.ihe.net/ITI/MHD/StructureDefinition/ihe-sourceId',
                            valueIdentifier: {
                                value: 'urn:oid:1.3.6.1.4.1.12559.11.13.2.5' // OID der publizierenden Organisation, unklar was das für eine OID ist
                            }
                        }
                    ],
                    identifier: [
                        {
                            use: 'official',
                            system: 'urn:ietf:rfc:3986',
                            value: submissionSetUrl
                        }
                    ],
                    status: 'current',
                    mode: 'working',
                    title: 'EPD Playground Testdokument (' + new Date().toLocaleDateString() + ')',
                    code: {
                        coding: [
                            {
                                system: 'http://profiles.ihe.net/ITI/MHD/CodeSystem/MHDlistTypes',
                                code: 'submissionset',
                                display: 'Submission Set'
                            }
                        ]
                    },
                    subject: {
                        reference: 'https://test.ahdis.ch/mag-bfh/fhir/Patient/' + OID_URN + '-' + getIdBySystemOID(OID_URN, this.patient)
                    },
                    entry: [
                      {
                        item: {
                          reference: documentReferenceUrl
                        }
                      }
                  ],
                    date: new Date().toISOString().substring(0,10) // ISO-String mit Zeit wird vom Mobile Access Gateway z.Z. (2021-11-22) nicht korrekt unterstützt
                }

                const documentReferenceResource = {
                    resourceType: 'DocumentReference',
                    contained: [
                        JSON.parse(JSON.stringify(this.patient)) // sonst ist es aus einem seltsamen grund null
                    ],
                    masterIdentifier: {
                        value: 'urn:oid:2.16.756.5.30.1.178.1.1.1.' + Math.floor(Math.random() * 1000000000) // Klinik Höheweg plus random Knoten
                    },
                    identifier: [
                        {
                            use: 'official',
                            system: 'urn:ietf:rfc:3986',
                            value: documentReferenceUrl
                        }
                    ],
                    status: 'current',
                    type: {
                        coding: [
                            {
                                system: 'http://snomed.info/sct',
                                code: '721912009',
                                display: 'Medication summary document (record artifact)'
                            }
                        ]
                    },
                    category: [
                        {
                            coding: [
                                {
                                    system: 'http://snomed.info/sct',
                                    code: '422735006',
                                    display: 'Summary clinical document (record artifact)'
                                }
                            ]
                        }
                    ],
                    subject: {
                        reference: 'https://test.ahdis.ch/mag-bfh/fhir/Patient/' + OID_URN + '-' + getIdBySystemOID(OID_URN, this.patient)
                    },
                    source: 'urn:oid:1.3.6.1.4.1.12559.11.13.2.5', // OID der publizierenden Organisation, unklar was das für eine OID ist
                    date: new Date().toISOString().substring(0,10), // ISO-String mit Zeit wird vom Mobile Access Gateway z.Z. (2021-11-22) nicht korrekt unterstützt
                    description: 'EPD Playground Testdokument (' + new Date().toLocaleDateString() + ')',
                    securityLabel: [
                        {
                            coding: [
                                {
                                    system: 'http://snomed.info/sct',
                                    code: '17621005',
                                    display: 'Normal (qualifier value)'
                                }
                            ]
                        }
                    ],
                    content: [
                        {
                            attachment: {
                                contentType: inputFile.type,
                                language: 'de-CH',
                                url: fileResourceUrl
                            },
                            format: {
                                system: 'urn:oid:1.3.6.1.4.1.19376.1.2.3',
                                code: 'urn:ihe:pharm:pml:2013',
                                display: 'Community Medication List'
                            }
                        }
                    ],
                    context: {
                        facilityType: {
                            coding: [
                                {
                                    system: 'http://snomed.info/sct',
                                    code: '264358009',
                                    display: 'General practice premises (environment)'
                                }
                            ]
                        },
                        practiceSetting: {
                            coding: [
                                {
                                    system: 'http://snomed.info/sct',
                                    code: '394802001',
                                    display: 'General medicine (qualifier value)'
                                }
                            ]
                        },
                        sourcePatientInfo: {
                            reference: '#' + this.patient.id
                        }
                    }
                };


                createDocumentBundle.entry = [
                    {
                        fullUrl: fileResourceUrl,
                        resource: fileResource,
                        request: {
                            method: 'POST',
                            url: fileResourceUrl
                        }
                    },
                    {
                        fullUrl: submissionSetUrl,
                        resource: submissionSetResource,
                        request: {
                            method: 'POST',
                            url: submissionSetUrl
                        }
                    },
                    {
                        fullUrl: documentReferenceUrl,
                        resource: documentReferenceResource,
                        request: {
                            method: 'POST',
                            url: documentReferenceUrl
                        }
                    }
                ]
                console.log(createDocumentBundle)
                this.$fhir.create(createDocumentBundle)
                .then((res) => {
                    this.display = 'See console.';
                    console.log('Create result', res)
                })
                .catch(err => {
                    this.display = 'Oops. Something went wrong.';
                    console.log(err);
                });
            })
            .catch(error => {
                console.log('Something went wrong encoding your file to base64', error);
            });
        },

        searchDocumentsByeprSpid(spid) {
            this.$fhir.search('DocumentReference', {
                status: 'current',
                'patient.identifier': EPR_SPID_OID + '|' + spid
            }).then((result) => {
                console.log('Search result', result);
                console.warn('set result to this.documents');
            })
            .catch(err => {
                this.display = 'Oops. Something went wrong.';
                console.log(err);
            });
        },

        refreshPatient() {
            this.isRefreshingPatient = true;
            getExamplePatientFromPatientGenerator()
            .then((patientResource) => {
                const timeString = Date.now().toString();
                // we need to replace the identifier from the Patient Generator
                patientResource.identifier = [
                    {
                        system: HOEHEWEG_OID,
                        // generate a patient id from the time string
                        // (to reduce the change of collision while keeping it readable)
                        value: 'PAT.' + timeString.substring(3,7) + '.' + timeString.substring(7,11),
                        assigner: {
                            display: 'Klinik H\u00f6heweg'
                        }
                    },
                    {
                        system: EPR_SPID_OID,
                        // generate a  EPR-SPID from the time string, for demo purposes
                        value: generateEprSpid(timeString.substring(3,12))
                    }
                ];
                this.patient = patientResource;
                this.patientIsNew = true;
                this.isRefreshingPatient = false;
            })
        }
    },
    mounted() {
        checkAvailability('http://patient-generator.i4mi.bfh.ch', 2000)
        .then((isAvailable) => {
            this.patientGeneratorAvailable = isAvailable;
            if (isAvailable) this.refreshPatient();
        })
        .catch((e) => {
            console.log('Error pinging patient generator', e)
            this.patientGeneratorAvailable = false;
        });
    }
}
</script>

<style scoped>
html {
    margin: 0;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}
a {
    color: #47A0DC;
    font-weight: bold;
}
a:hover {
    color: black;
}
h1 {
    color: #47A0DC;
}
h2 {
    font-size: 1.4em;
    margin-bottom: 0;
    margin-top: 2em;
    text-align: left !important;
    margin-left: 8%;
}
li {
    list-style-type: none;
    text-align: left;
    margin-bottom: 1em;
    border-bottom: 1px solid grey;
}
li p {
    margin: 0;
}
li h3 {
    color: #47A0DC;
    font-weight: bold;
    margin-bottom: 0.2em;
}
li button {
    margin: 0.5em 25%;
    width: 50%;
}
li label {
    margin: 1em 0 0.5em 1em;
    width: 30%;
}
li input {
    margin: 1em 0.5em 0.5em 0.5em;
    width: 40%;
}
p.result {
    margin: 0.5em 1em;
    width: 50%;
}
p {
    text-align: justify;
    margin-left: 5%;
    margin-right: 5%;
}
ul {
    padding: 10px;
    margin-left: 8%;
    margin-right: 8%;
    margin-bottom: 3em;
    margin-top: 0;
}
small {
    text-align: left !important;
}
.isnotnew-tip {
    font-size: 0.55em;
    color: grey;
    margin-left: 25%;
}
.patgen-not-available {
    padding: 1em;
    background-color: #ffdadb;
    border-radius: 0.5em;
}

p#display {
    margin-left: 5vw;
    margin-right: 5vw;
    font-family: Courier, serif;
    display: block;
    text-align: left;
    color: #EEEEEE;
    background: black;
    padding: 5px;
    border-radius: 5px;
    position: absolute;
    width: 90vw;
    bottom: 0;
    overflow-y: scroll;
    height: 10em;
}

</style>
