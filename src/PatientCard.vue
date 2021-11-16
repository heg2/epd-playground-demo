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
                                : 'O'}}</span>
            </li>
            <li>
                <b>Geburtsdatum: </b>
                <span>{{ new Date(patient.birthDate).toLocaleString().split(',')[0] }}</span>
            </li>
            <li>
                <b>ID H&ouml;heweg: </b>
                <span>{{ findId('urn:oid:2.16.756.5.30.1.178.1.1') }}</span>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name: 'patient-card',
    components: {
    },
    props: {
        patient: {},
        onRefresh: Function,
    },
    data: () => ({

    }),
    methods: {
        findId(system) {
            console.log('suche id', system, this.patient.identifier)
            const identifier = this.patient.identifier.find(identifier => identifier.system == system);
            console.log(identifier)
            return identifier
                        ? identifier.value
                        : '-';
        }
    },
    mounted() {
        console.log(this.patient)
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
    display: block;
    position: relative;
    top: -175px;
    width: 100%;
    left: 20px;
}
.pc-patient-data li {
    margin-top: 0.1em;
}
</style>