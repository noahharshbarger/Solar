const materialsList = {
    'Stack SS-8':{
    name: 'STACK SS-8',
    type: 'Feet',
    brand: 'Solar Stack',
    curtisPrice: null,
    anthonyPrice: null,
    source: 'Domestic',
    notes: 'Each foot is one dot on the panels on the plan set'
    }, 
    'IRIDG QM-HUG-01-M1':{
    name: 'IRIDG QM-HUG-01-M1',
    type: 'Feet',
    brand: null,
    curtisPrice: 7.99 ,
    anthonyPrice: 6.61 ,
    source: 'Non-Domestic',
    notes: null
    },
    'UNIRC SHBUTYLM2':{
    name: 'UNIRC SHBUTYLM2',
    type: 'Rail',
    brand: null,
    curtisPrice: null,
    anthonyPrice: null,
    source: 'Non-Domestic',
    notes: null
    },
    'IRIDG XR-10-168M':{
    name: 'IRIDG XR-10-168M',
    type: 'Rail',
    brand: null,
    curtisPrice: 35.61 ,
    anthonyPrice: 26.04 ,
    source: 'Non-Domestic',
    notes: 'must match or exceed the span of the panels. we can use a splice to put two rails together. panel length ans width varies and so do rail lenghts'
    },
    'Unirac Domestic - 185RLM1-US':{
    name: 'Unirac Domestic - 185RLM1-US',
    type: 'Rail',
    brand: null,
    curtisPrice: null ,
    anthonyPrice: null ,
    source: 'Domestic',
    notes: null
    },
    'IRIDG UFO-CL-01-M1':{
    name: 'Unirac Domestic - 185RLM1-US',
    type: 'Mids',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 2.63,
    source: null,
    notes: 'mids go in in between every panel. Need one mid on each rail on the top and bottom in between panels. Mids are only needed for panels on the same rail'
    },
    'Unirac Domestic - CCLAMPD1-US':{
    name: 'Unirac Domestic - CCLAMPD1-US',
    type: 'Mids',
    brand: null,
    curtisPrice: null,
    anthonyPrice: null,
    source: null,
    notes: null
    },
    'IRIDG UFO-END-01-M1':{
    name: 'IRIDG UFO-END-01-M1',
    type: 'Ends',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 3.96,
    source: null,
    notes: 'Ends go on the end of each rail. If we have a staggered layout and we set up multiple rails, we will need an end at the end each rail.'
    },
    'Unirac Domestic - CCLAMPD1-US':{
    name: 'Unirac Domestic - CCLAMPD1-US',
    type: 'Ends',
    brand: null,
    curtisPrice: null,
    anthonyPrice: null,
    source: null,
    notes: null
    },
    'Unirac - SHCLMPM2':{
    name: 'Unirac - SHCLMPM2',
    type: 'Stronghold Rail Clamp (Unirac)',
    brand: null,
    curtisPrice: null,
    anthonyPrice: null,
    source: null,
    notes: 'only needed with Unirac and serves the same function as the rail bolts. Equivalent to the number of feet'
    },
    'IRIDG XR10-BOSS-01-M1':{
    name: 'IRIDG XR10-BOSS-01-M1',
    type: 'Splices',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 5.03,
    source: null,
    notes: null
    },
    'Unirac Domestic - RLSPLCM2-US':{
    name: 'Unirac Domestic - RLSPLCM2-US',
    type: 'Splices',
    brand: null,
    curtisPrice: null,
    anthonyPrice: null,
    source: null,
    notes: null
    },
    'Unirac Domestic - MLPEMNT-US':{
    name: 'Unirac Domestic - MLPEMNT-US',
    type: 'MLPE Mount - UNIRAC',
    brand: null,
    curtisPrice: null,
    anthonyPrice: null,
    source: null,
    notes: 'only needed with Unirac and serves the same function as t bolts'
    },
    'IRIDG XR-LUG-03-A1':{
    name: 'IRIDG XR-LUG-03-A1',
    type: 'MLPE Mount - UNIRAC',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 4.76,
    source: null,
    notes: 'Every rail gets one ground lug'
    },
    'IRIDG BHW-TB-03-A1':{
    name: 'IRIDG BHW-TB-03-A1',
    type: 'Rail Bolts',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 1.70,
    source: null,
    notes: 'only needed with IronRidge. Equivalent to the number of feet'
    },
    'IRIDG BHW-MI-01-A1':{
    name: 'IRIDG BHW-MI-01-A1',
    type: 'T Bolts',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 1.08,
    source: null,
    notes: 'only needed with IronRidge and serves the same function as the MLPE mount with Unirac'
    },
    'IRIDG HW-RD1430-01-M1':{
    name: 'IRIDG HW-RD1430-01-M1',
    type: '3" Mounting Screws',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 0.73,
    source: null,
    notes: '6 x the number of feet'
    },
    'IRIDG QM-BUG-01-M1':{
    name: 'IRIDG QM-BUG-01-M1',
    type: 'Conduit mount',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 0.73,
    source: null,
    notes: 'need a counduit pipe to connect each array. Need a mount to hold up the conduit anytime the roof plane changes. Will need one mount on both roof planes when the conduit is in a v shape. Will need 3 mounts when the conduit is bent in an A shape'
    },
    'JINKO JKM425N-54HL4-B':{
    name: 'JINKO JKM425N-54HL4-B',
    type: 'Panels',
    brand: null,
    curtisPrice: 158.31,
    anthonyPrice: 146.39,
    source: null,
    notes: null
    },
    'HYUND HIS-T435NF(BK)':{
    name: 'HYUND HIS-T435NF(BK)',
    type: 'Panels',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 132.92,
    source: null,
    notes: null
    },
    'QCELL Q.PEAK DUO BLK ML-G10+ 415':{
    name: 'QCELL Q.PEAK DUO BLK ML-G10+ 415',
    type: 'Panels',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 202.56,
    source: 'Domestic',
    notes: null
    },
    'QCELL Q.TRON BLK M-G2+/AC 430':{
    name: 'QCELL Q.TRON BLK M-G2+/AC 430',
    type: 'Panels',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 372.11,
    source: 'Non-Domestic',
    notes: null
    },
    'QCELL Q.TRON BLK M-G2+ 435':{
    name: 'QCELL Q.TRON BLK M-G2+ 435',
    type: 'Panels',
    brand: null,
    curtisPrice: 242.12,
    anthonyPrice: 227.17,
    source: 'Non-Domestic',
    notes: null
    },
    'QCELL Q.TRON BLK M-G2.H+ 430':{
    name: 'QCELL Q.TRON BLK M-G2.H+ 430',
    type: 'Panels',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 224.56,
    source: 'Domestic',
    notes: null
    },
    'QCELL Q.TRON BLK M-G2.H+ 435':{
    name: 'QCELL Q.TRON BLK M-G2.H+ 435',
    type: 'Panels',
    brand: null,
    curtisPrice: null,
    anthonyPrice: 241.67,
    source: 'Domestic',
    notes: null
    },
    'Enphase Combiner - IQ Combiner 5/5C - (comes with 15A breaker) - (ENP X-IQ-AM1-240-5C-HDK with cell kit compatibility and has Envoy Built into it)':{
    name: 'Enphase Combiner - IQ Combiner 5/5C - (comes with 15A breaker) - (ENP X-IQ-AM1-240-5C-HDK with cell kit compatibility and has Envoy Built into it)',
    type: 'Enphase Material',
    brand: null,
    curtisPrice: 1063.21,
    anthonyPrice: null,
    source: null,
    notes: null
    },
    'ENP X-IQ-AM1-240-5-HDK':{
    name: 'ENP X-IQ-AM1-240-5-HDK',
    type: 'Enphase Material',
    brand: null,
    curtisPrice: 686.31,
    anthonyPrice: 617.36,
    source: null,
    notes: 'Anything over 4 strings will need a load center instead of a combiner'
    },
    'ENP CELLMODEM-M1-06-SP-05 LTE CAT M1 W/ 5-YR SPRINT':{
    name: 'ENP CELLMODEM-M1-06-SP-05 LTE CAT M1 W/ 5-YR SPRINT',
    type: 'Enphase Material',
    brand: null,
    curtisPrice: 369.58,
    anthonyPrice: 345.53,
    source: null,
    notes: 'always 1 cell kit is needed'
    },
    'ENP ENV2-IQ-AM1-240':{
    name: 'ENP ENV2-IQ-AM1-240',
    type: 'Enphase Material',
    brand: null,
    curtisPrice: 492.39,
    anthonyPrice: null,
    source: null,
    notes: 'comes with the combiner. If we are installing a load center, we will need to order an Envoy'
    },
    'IQ8HC-72-M-DOM-US (240V) (Domestic)':{
    name: 'IQ8HC-72-M-DOM-US (240V) (Domestic)',
    type: 'Enphase Material',
    brand: null,
    curtisPrice: 236.90,
    anthonyPrice: null,
    source: null,
    notes: 'comes with the combiner. If we are installing a load center, we will need to order an Envoy'
    }, 
}