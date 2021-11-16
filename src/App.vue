<template>
    <div id="app">
        <h1>EPD Playground Demo App</h1>
        <p>Das ist eine simple Demo App, wie mit JsOnFhir über den Mobile Access Gateway auf den EPD Playground zugegriffen werden kann.</p>
        <p>Mit dem Patient Generator können Beispiel-Patienten erstellt werden. Dazu muss man sich aber im BFH-Netz befinden (oder per VPN eingewählt sein). Kudos an Robin Glauser für das Erstellen des Patient Generators.</p>
        <patient-card v-if="patient" :patient="patient" :onRefresh="() => this.refreshPatient()">
        </patient-card>
        <p>Es gibt folgende Aktionen. Aktiviere die Browser-Konsole für mehr Informationen.<br />(auf Mac: [alt] [cmd] [I], auf Windows: [Ctrl] [Shift] [I])</p>
        <ul>
            <li>
                <a @click="createPatient">Beispielpatient auf EPD Playground schreiben</a>
            </li>
            <li>
                <a @click="searchLocalId">EPD SPID von Playground laden, anhand lokaler ID (PIXm)</a>
            </li>
            <li>
                <a @click="loadPatientBySPID('761337615370536004')">Patient laden (mit EPD SPID)</a>
            </li>
            <li>
                <a @click="uploadDocument">upload a document</a>
                <input type="file" ref="documentInput" />
            </li>
            <li>
                <a @click="searchDocuments">search documents</a>
            </li>
        </ul>

        <!--p id="display" v-if="display!= ''">
            {{ display }}<br /><br />
            See browser console for details.
        </p-->
    </div>
</template>

<script>
// Vue Components
import PatientCard from './PatientCard.vue';

// global constants and helper functions
import { EPD_SPID_OID, HOEHEWEG_OID } from '../static/oids.js';
import { getIdBySystemOID, convertToBase64 } from './helpers.js';

// JSON templates
import createPatientMessage from '../static/createMessageTemplate.json';
import organizationHoeheweg from '../static/organizationHoeheweg.json';
import createDocumentBundle from '../static/createDocumentBundle.json';

export default {
    name: 'app',
    components: {
        'patient-card': PatientCard
    },
    data(){
        return {
            patient: {},
            isRefreshingPatient: false,
            // searchType defines the type of the resource you want to search
            searchType: 'DocumentReference',
            // searchParam defines the parameters for your search (can be null)
            searchParam: {
                "status": 'current',
                "patient.identifier": "urn:oid:1.1.1.99.1|0f5a8034-3c8a-4796-bd39-d3ea877a4155"
            }
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
            })
            .catch(err => {
                this.display = 'Oops. Something went wrong.';
                console.log(err);
            });
        },

        searchLocalId() {
            // We search for the patients EPD SPID as registered on the EPD Playground
            // by using the local ID (which is also registered in the EPD Playground)

            const SEARCH_PARAMS = {
                // sourceIdentifier is the ID we know (local ID from Klinik Höheweg)
                sourceIdentifier: HOEHEWEG_OID + '|' + getIdBySystemOID(HOEHEWEG_OID, this.patient),
                // target system is the ID we want
                targetSystem:  EPD_SPID_OID
            }
            this.$fhir.performOperation('ihe-pix', {}, 'GET', SEARCH_PARAMS, 'Patient')
            .then((result) => {
                console.log('Server answer', result);
                if (result.body && result.body.parameter && result.body.parameter[0].valueIdentifier) {
                    console.log('EPD SPID is', result.body.parameter[0].valueIdentifier.value);
                }

            })
            .catch(err => {
                this.display = 'Oops. Something went wrong.';
                console.log(err);
            });
        },

        loadPatientBySPID(spid) {
            const SEARCH_PARAMS = {
                identifier: EPD_SPID_OID + '|' + spid
            }
            this.$fhir.search('Patient', SEARCH_PARAMS)
            .then((result) => {
                if (result.entry && result.entry[0] && result.entry[0].resource) {
                    this.patient = result.entry[0].resource;
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
                createDocumentBundle.entry[0].resource = {
                    "resourceType": "Binary",
                    "contentType": inputFile.type,
                    "data": base64
                }
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

        searchDocuments() {
            this.$fhir.search('DocumentReference', {
                "status": "current",
                "patient.identifier": "urn:oid:1.1.1.99.1%7C0f5a8034-3c8a-4796-bd39-d3ea877a4155"
            }).then((result) => {
                this.display = 'See console.';
                console.log('Search result', result)
            })
            .catch(err => {
                this.display = 'Oops. Something went wrong.';
                console.log(err);
            });
        },

        getExamplePatientFromPatientGenerator() {
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
        },

        refreshPatient() {
            this.isRefreshingPatient = true;
            this.getExamplePatientFromPatientGenerator()
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
                        system: EPD_SPID_OID,
                        // generate a random EPD SPID for demo purposes
                        value: '7613376153' + timeString.substring(3,11)
                    }
                ];
                this.patient = patientResource;
                this.isRefreshingPatient = false;
            })
        }

    },
    mounted() {
        this.refreshPatient();
    }
}
</script>

<style>
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
    max-width: 800px;
}
a {
    color: #47A0DC;
    font-weight: bold;
}
a:hover {
    color: black;
}
li {
    list-style-type: none;
    text-align: left;
    margin-top: 0.5em;
}
p, ul {
    text-align: justify;
    margin-left: 20%;
    margin-right: 20%;
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
