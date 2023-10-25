var vm = new Vue({
    delimiters: ["[[", "]]"],
    el: '#app',
    data:{
        tmp_acc: null,
        tmp_passwd: null,
        now_user: "",
        now_user_name: "",
        now_user_is_admin: false,
        now_venue: "",
        now_date: "",
        now_week0: "",
        now_week6: "",
        max_hour_aweek: 6,
        now_day: [],
        now_hour: "",
        now_my_records: [],
        now_reserve_settings: {
            "starttime":"",
            "endtime":"",
            "contactperson":"",
            "phone":"",
            "line":"",
            "coordinatable":false,
        },
        venues: [
            {
                'venueID':'FLAT001',
                'location': 'sportscenter',
                'shadeornot': '1',
                'imgurl': 'https://rent.pe.ntu.edu.tw/udf/1653528788045604800.png'
            },
            {
                'venueID':'MOUNTAIN001',
                'location': 'halfcourt',
                'shadeornot': '0',
                'imgurl': 'https://rent.pe.ntu.edu.tw/udf/1653530905083666600.png'
            },
            {
                'venueID':'MOUNTAIN002',
                'location': 'freshman',
                'shadeornot': '0',
                'imgurl': 'https://rent.pe.ntu.edu.tw/udf/1664779143087713100.jpg'
            },
        ],
        records: [
            {
                "recordID": 0,
                "acc": "csvbboys159159",
                "courtID": "MOUNTAIN001",
                "rdate": "2021-06-30",
                "line": "",
                "contactperson": "peter",
                "phone": "0900123123",
                "starttime": "19",
                "endtime": "21",
                "coordinateornot": "1",
                "cancelornot": "0",
            },
            {
                "recordID": 1,
                "acc": "bavbboys159159",
                "courtID": "MOUNTAIN001",
                "rdate": "2021-06-30",
                "line": "",
                "contactperson": "jacky",
                "phone": "0911123123",
                "starttime": "17",
                "endtime": "19",
                "coordinateornot": "1",
                "cancelornot": "0",
            },
        ],
    },
    computed: {
    },
    watch: {
        now_user: function(){
            this.findMyRecords();
        },
        now_venue: function(){
            this.now_day = [];
            this.now_date = "";
        },
        now_date: function(){
            var now = new Date(this.now_date);
            var week0 = new Date(now.setDate(now.getDate()-now.getDay()));
            console.log(week0);
            var week6 = new Date();
            week6.setDate(week0.getDate()+6);
            this.now_week0 = week0.getFullYear()+'-'+(week0.getMonth()+1)+'-'+week0.getDate();
            this.now_week6 = week6.getFullYear()+'-'+(week6.getMonth()+1)+'-'+week6.getDate();
        },
    },
    methods:{
        login(){
            var login_api =  `http://127.0.0.1:8000/login/?acc=${this.tmp_acc}&passwd=${this.tmp_passwd}`;
            fetch(login_api, {
                method: 'GET',
            })
            .then(res => {
                return res.json();
            })
            .then(acc_info => {
                //console.log(acc_info);
                if(Object.keys(acc_info).length==0){
                    alert("Wrong Account / Password !");
                }
                else{
                    this.now_user = acc_info["acc"];
                    this.now_user_is_admin = acc_info["is_admin"]
                    if(this.now_user_is_admin){
                        this.now_user_name = "管理員";
                    }
                    else{
                        this.now_user_name = acc_info["teamname"];
                    }
                }
            })
        },
        logout(){
            this.now_user="";
            this.now_user_name="";
            this.now_user_is_admin=false;
            this.now_venue="";
            this.now_date="";
            this.tmp_acc="";
            this.tmp_passwd="";
            // now_day needs to be cleared
        },
        getVenues(){
            var get_venues_api = `http://127.0.0.1:8000/getVenues`;
            return fetch(get_venues_api, {
                method: 'GET',
            })
            .then(res => {
                return res.json();
            })
            .then(venues => {
                this.venues = venues;
            })
        },
        findMyRecords(){
            var get_my_api =  `http://127.0.0.1:8000/getMyRecords/?acc=${this.now_user}`;
            fetch(get_my_api, {
                method: 'GET',
            })
            .then(res => {
                return res.json();
            })
            .then(records => {
                this.now_my_records = records;
            })
        },
        chooseVenue(str){
            this.now_venue = str;
        },
        async chooseDay(){
            console.log(this.now_date);

            var get_day_api =  `http://127.0.0.1:8000/getDayRecords/?date=${this.now_date}`;
            await fetch(get_day_api, {
                method: 'GET',
            })
            .then(res => {
                return res.json();
            })
            .then(records => {
                this.now_day = new Array(24).fill(null);
                this.records = records;
                for(var r of this.records){
                    if(r.venueid==this.now_venue && r.rdate==this.now_date){
                        //console.log(r);
                        var start = parseInt(r.starttime);
                        var end = parseInt(r.endtime);
                        for(var i=start;i<end;i++){
                            this.now_day[i] = r;
                        }
                    }
                }
            })

            return;
        },
        chooseHour(_i){
            i = parseInt(_i);
            this.now_hour = i;
            this.now_reserve_settings["starttime"] = i;
            this.now_reserve_settings["endtime"] = i+1;
        },
        async hoursAWeek(){
            var hours_api =  `http://127.0.0.1:8000/hoursAWeek/?acc=${this.now_user}&from=${this.now_week0}&to=${this.now_week6}`;
            return await fetch(hours_api, {
                method: 'GET',
            })
            .then(res => {
                return res.json();
            })
            .then(hours => {
                return hours;
            })
        },
        async insertRecord(){
            if(String(this.now_reserve_settings["starttime"])=="" || String(this.now_reserve_settings["endtime"])==""){
                alert("Start Time & End Time should not be enpty.");
                return;
            }
            if(String(this.now_reserve_settings["contactperson"])==""){
                alert("Contactperson should not be enpty.");
                return;
            }
            if(String(this.now_reserve_settings["phone"])==""){
                alert("Phone should not be enpty.");
                return;
            }
            var hours = await this.hoursAWeek();
            var hours_plus_reserving = hours+(this.now_reserve_settings["endtime"] - this.now_reserve_settings["starttime"]);
            if(!this.now_user_is_admin && hours_plus_reserving > this.max_hour_aweek){
                alert("You have achieved maximumn reservation number ("+this.max_hour_aweek+" hours) in this week.\nYou have reserved: "+hours+" hours.")
                return;
            }
            var out_this = this;
            this.chooseDay().then(function(){
                var scope_is_empty = true;
                for(var i=out_this.now_reserve_settings["starttime"];i<out_this.now_reserve_settings["endtime"];i++){
                    if(out_this.now_day[i]!=null){
                        scope_is_empty = false;
                        break;
                    }
                }
                if(scope_is_empty==false){
                    alert("A part of the time scope is occupied. Failed to reserve!");
                }
                else{
                    var insert_api =  `http://127.0.0.1:8000/insertRecord/`;
                    var insert_data = out_this.now_reserve_settings;
                    insert_data["acc"] = out_this.now_user;
                    insert_data["venueID"] = out_this.now_venue;
                    insert_data["rdate"] = out_this.now_date;
                    //insert_data["cancelornot"] = false;
                    fetch(insert_api, {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify(insert_data), // data can be `string` or {object}!
                        headers: new Headers({
                        'Content-Type': 'application/json'
                        })
                    }).then(res => {
                        res.json();
                        console.log(123132);
                        out_this.chooseDay();
                        out_this.findMyRecords();
                    })
                }
            });
        },
        lazyDelete(_id){
            var lazy_delete_api =  `http://127.0.0.1:8000/lazyDelete/?id=${_id}`;
            fetch(lazy_delete_api, {
                method: 'GET',
            })
            .then(res => {
                return String(res);
            })
            .then(rlt => {
                console.log("Delete "+_id+": Successful");
                this.chooseDay();
                this.findMyRecords();
            })
        },
    },
    mounted: async function(){
    },
    created: async function(){
        await this.getVenues();
        this.findMyRecords();

        $(document).ready(function(){
            $("#result-frame").css("padding-top", $("#navbar").outerHeight()+20);
            $('.datepicker').datepicker({
                maxDate: 14,
                minDate: 0,
            }).on('change', function(e) {
                var splited = $(this).val().split('/');
                var new_date = splited[2]+'-'+splited[0]+'-'+splited[1];
                vm.$data.now_date =  new_date;
                vm.chooseDay();
            });
            $('.admin-datepicker').datepicker({
               
            }).on('change', function(e) {
                var splited = $(this).val().split('/');
                var new_date = splited[2]+'-'+splited[0]+'-'+splited[1];
                vm.$data.now_date =  new_date;
                vm.chooseDay();
            });
        });
    }
});
	

