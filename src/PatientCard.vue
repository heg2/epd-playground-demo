<template>
    <div class="patient-card">
        <img src="../static/img/ch.png" class="pc-flag">
        <img src="../static/img/portrait.png" class="pc-portrait">
        <span class="pc-refresh" @click="onRefresh">⟳</span>
        <span class="pc-title">EPD Playground Beispiel-Patient<span v-if="patient.gender==='female'">in</span></span>
        <ul v-if="patient.name" class="pc-patient-data">
            <li>
                <b>Name: </b>
                <span> {{patient.name[0].given ? patient.name[0].given[0] : ''}} {{patient.name[0].family}}</span>
            </li>
            <li>
                <b>Geschlecht: </b>
                <span>{{ patient.gender === 'female'
                            ? 'W'
                            : patient.gender === 'male'
                                ? 'M'
                                : 'A'}}</span>
            </li>
            <li>
                <b>Geburtsdatum: </b>
                <span>{{ new Date(patient.birthDate).toLocaleString().split(',')[0] }}</span>
            </li>
            <li>
                <b>PID H&ouml;heweg: </b>
                <small>{{ findId(hoehewegOid) }}</small>
            </li>
            <li>
                <b>EPD SPID: </b>
                <small>{{ findId(epdSpidOid) }}</small>
            </li>
        </ul>
    </div>
</template>

<script>
import { getIdBySystemOID, EPD_SPID_OID, HOEHEWEG_OID  } from './helpers.js'

export default {
    name: 'patient-card',
    components: {
    },
    props: {
        patient: {},
        onRefresh: Function,
    },
    data: () => ({
        epdSpidOid: EPD_SPID_OID,
        hoehewegOid: HOEHEWEG_OID
    }),
    methods: {
        findId(system) {
            return getIdBySystemOID(system, this.patient);
        }
    },
    mounted() {
    }
};
</script>

<style scoped>
.patient-card {
    background: linear-gradient(90deg, rgba(193,208,203,1) 0%, rgba(127,152,185,1) 35%, rgba(193,186,195,1) 100%);
    height: 223px;
    width: 356px;
    border-radius: 10px;
    display: inline-block;
    text-align: left;
    box-shadow: 5px 5px 10px #ddd;
    margin-bottom: -200px;
}
.pc-flag {
    height: 30px;
    width: 30px;
    position: relative;
    display: block;
    top: 15px;
    left: 20px;
}
.pc-portrait {
    height: 130px;
    position: relative;
    display: block;
    top: 35px;
    left: 20px;
}
.pc-title {
    color: #777;
    display: block;
    position: relative;
    top: -190px;
    left: 65px;
    margin: 0;
    z-index: 10;
}
.pc-refresh {
    font-size: 2em;
    margin: 0;
    z-index: 100;
    cursor: pointer;
    margin-right: 0px;
    text-align: right;
    display: block;
    margin-right: 10px;
    top: -160px;
    position: relative;
}
.pc-patient-data {
    display: grid;
    position: relative;
    top: -175px;
    width: 220px;
    left: 90px;
    margin-left: 0;
    margin-right: 0;
}
.pc-patient-data li {
    list-style-type: none;
    text-align: left;
    margin-top: 0.1em;
    border-width: 0;
}
</style>