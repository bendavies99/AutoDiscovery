/*
YYYY is discovery tipic
XXXX is device name
Send out HA MQTT Discovery message on MQTT connect (~2.4kB):
{
"name": "XXXX",
"stat_t":"YYYY/c",
"cmd_t":"YYYY",
"rgb_stat_t":"YYYY/c",
"rgb_cmd_t":"YYYY/col",
"bri_cmd_t":"YYYY/bri",
"bri_stat_t":"YYYY/b",
"bri_val_tpl":"{{value}}",
"rgb_cmd_tpl":"{{'#%02x%02x%02x' | format(red, green, blue)}}",
"rgb_val_tpl":"{{value[1:3]|int(base=16)}},{{value[3:5]|int(base=16)}},{{value[5:7]|int(base=16)}}",
"qos": 0,
"opt":true,
"pl_on": "ON",
"pl_off": "OFF",
"fx_cmd_t":"YYYY/sfx",
"fx_stat_t":"YYYY/fx",
"fx_val_tpl":"{{value}}",
"fx_list":[
"[FX=00] Solid",
"[FX=01] Blink",
"[FX=02] ...",
"[FX=79] Ripple"
]
}
  */

const fxNames = [
    "Solid","Blink","Breathe","Wipe","Wipe Random","Random Colors","Sweep","Dynamic","Colorloop","Rainbow",
    "Scan","Dual Scan","Fade","Chase","Chase Rainbow","Running","Saw","Twinkle","Dissolve","Dissolve Rnd",
    "Sparkle","Dark Sparkle","Sparkle+","Strobe","Strobe Rainbow","Mega Strobe","Blink Rainbow","Android","Chase","Chase Random",
    "Chase Rainbow","Chase Flash","Chase Flash Rnd","Rainbow Runner","Colorful","Traffic Light","Sweep Random","Running 2","Red & Blue","Stream",
    "Scanner","Lighthouse","Fireworks","Rain","Merry Christmas","Fire Flicker","Gradient","Loading","In Out","In In",
    "Out Out","Out In","Circus","Halloween","Tri Chase","Tri Wipe","Tri Fade","Lightning","ICU","Multi Comet",
    "Dual Scanner","Stream 2","Oscillate","Pride 2015","Juggle","Palette","Fire 2012","Colorwaves","BPM","Fill Noise","Noise 1",
    "Noise 2","Noise 3","Noise 4","Colortwinkle","Lake","Meteor","Smooth Meteor","Railway","Ripple"
];

fxNames.forEach((fx, index, names) => {
    names[index] = `[FX=${index < 10 ? '0' + index : index}] ${fx}`;
});

console.log(fxNames);


const devices = [
    // {
    //     id: 1,
    //     name: 'Fridge Lights'
    // },
    // {
    //     id: 2,
    //     name: 'Undercupboard Fridge Lights'
    // },
    // {
    //     id: 3,
    //     name: 'Overcupboard Fridge Lights'
    // },
    // {
    //     id: 4,
    //     name: 'Oven Lights'
    // },
    // {
    //     id: 5,
    //     name: 'Undercupboard Oven Lights'
    // },
    // {
    //     id: 6,
    //     name: 'Overcupboard Oven Lights'
    // },
    {
        id: 1,
        area: 'Outside',
        name: 'Outside Lights'
    },
    // {
    //     id: 1,
    //     name: 'Fireplace Lights',
    //     area: 'Lounge'
    // }
];



const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://192.168.1.200');
client.on('connect', function () {
    devices.forEach((device => {
        const yyyy = (device.area ? device.area : 'Kitchen') + '-Strip-' + device.id;
        const deviceTopic = (device.area ? device.area + '/' : 'Kitchen/') + device.id;
        const json = {
            name: device.name,
            stat_t: `${deviceTopic}/c`,
            cmd_t:`${deviceTopic}`,
            rgb_stat_t:`${deviceTopic}/c`,
            rgb_cmd_t:`${deviceTopic}/col`,
            bri_cmd_t:`${deviceTopic}/bri`,
            bri_stat_t:`${deviceTopic}/b`,
            bri_val_tpl:"{{value}}",
            rgb_cmd_tpl:"{{'#%02x%02x%02x' | format(red, green, blue)}}",
            rgb_val_tpl:"{{value[1:3]|int(base=16)}},{{value[3:5]|int(base=16)}},{{value[5:7]|int(base=16)}}",
            qos: 0,
            opt:true,
            pl_on: "ON",
            pl_off: "OFF",
            fx_cmd_t:`${deviceTopic}/sfx`,
            fx_stat_t:`${deviceTopic}/fx`,
            fx_val_tpl:"{{value}}",
            fx_list:[
                ...fxNames
            ]
        };

        client.publish(`homeassistant/light/${yyyy}/config`, JSON.stringify(json), { retain: true });
        console.log(`Device ${yyyy} has been discorved!`);
    }));
    setTimeout(() => client.end(true), 5000);
    // mqtt:
    // broker: 192.168.1.200
    // discovery: true
})