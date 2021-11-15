<template>
    <div id="app">
        <h1>EPD Playground Demo</h1>
        <p>Das ist eine simple Demo App, wie mit JsOnFhir über den Mobile Access Gateway auf den EPD Playground zugegriffen werden kann.</p>
        <p>Es gibt folgende Aktionen. Aktiviere die Browser-Konsole für mehr Informationen.</p>
        <p v-if="patient.name && patient.name[0]">
            Patient: {{patient.name[0].given ? patient.name[0].given[0] : ''}} {{patient.name[0].family}}
            <span @click="refreshPatient">⟳</span>
        </p>

        <ul>
            <li>
                <a @click="createPatient">create patient</a>
            </li>
            <li>
                <a @click="pixm">Search local ID using the EPR-SPID (PIXm)</a>
            </li>
            <li>
                <a @click="searchPatient">search patient by any identifier</a>
            </li>
            <li>
                <a @click="uploadDocument">upload a document</a>
                <input type="file" ref="documentInput" />
            </li>
            <li>
                <a @click="searchDocuments">search documents</a>
            </li>

        </ul>

        <p id="display" v-if="display!= ''">
            {{ display }}<br /><br />
            See browser console for details.
        </p>
    </div>
</template>

<script>
import createPatientBundle from '../static/createPatientBundle.json';
import createDocumentBundle from '../static/createDocumentBundle.json';
import document from '../static/document.pdf';

function convertToBase64(file) {
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

export default {
    name: 'app',
    components: {
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
            },
            // loggedIn keeps track of the logged in state (for GUI adjustment)
            // display shows some results of the actions
            display: ''
        }
    },

    // methods are used for click events only in this app
    methods: {
        createPatient() {
            // add Patient to
            createPatientBundle.entry.find(entry => entry.resource.resourceType === 'Patient').resource = this.patient;
            this.$fhir.performOperation('process-message', createPatientBundle)
            .then(result => {
                console.log('Create Patient server response:',result);
            })
            .catch(err => {
                this.display = 'Oops. Something went wrong.';
                console.log(err);
            });
        },

        pixm() {
            this.$fhir.performOperation('ihe-pix', {}, 'GET', {sourceIdentifier: 'urn:oid:2.16.756.5.30.1.127.3.10.3|DEMO', targetSystem: 'urn:oid:2.16.756.5.30.1.178.1.1'}, 'Patient')
            .then((result) => {
                this.display = 'See console.';
                console.log('pixm result', result)
            })
            .catch(err => {
                this.display = 'Oops. Something went wrong.';
                console.log(err);
            });
        },

        searchPatient() {
            this.$fhir.search('Patient', {identifier: 'identifier=2.16.756.5.30.1.127.3.10.3|DEMO'})
            .then((result) => {
                this.display = 'See console.';
                console.log('Search result', result)
            })
            .catch(err => {
                this.display = 'Oops. Something went wrong.';
                console.log(err);
            });
        },

        uploadDocument() {
            const inputFile = this.$refs.documentInput.files[0];
            console.log('input', inputFile)
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
            .then((res) => {
                this.patient = res;
                this.isRefreshingPatient = false;
            })
        }

    },
    mounted() {
        this.refreshPatient()
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
    max-width: 600px;
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

.patient-card {
    background: linear-gradient(90deg, rgba(193,208,203,1) 0%, rgba(127,152,185,1) 35%, rgba(193,186,195,1) 100%);
    height: 223px;
    width: 356px;
    border-radius: 10px;
}
</style>
