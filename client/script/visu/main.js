function EditProg() {
    this.type = VISU_TYPE.MAIN;
    this.container = {};
    this.data = [];
    this.data_ini = [];
    this.phone = [];
    this.initialized = false;
    this.controller_state = null;
    this.t1 = null;
    this.saveB = null;
    this.getB = null;
    this.helpB = null;
    this.bb = null;
    this.update = true;//editor will make it false
    this.last_sr = -1;
    this.last_sc = -1;
    this.del_block = false;//to deal with delete button and table click collision
    this.ROW = {
        COPE_TIME: 0,
        RING_INTERVAL: 1,
        SMS_INTERVAL: 2
    };
    this.ACTION = {
        GET: 3,
        SAVE: 4,
        RESET: 6
    };
    this.ACTIVE_SIGN = "&check;";
    this.FLOAT_PRS = 3;
    this.visible = false;
    this.init = function () {
        try {
            var self = this;
            this.container = cvis();
            this.t1 = new Table(self, 1, trans, [
                [300, "33%"],
                [301, "33%"],
                [302, "33%"]
            ]);
            this.t1.m_style = "copy_cell";
            this.t1.cellClickControl([true, true, true]);
            this.t1.enable();
            this.saveB = cb("");
            this.getB = cb("");
            this.helpB = new NavigationButton(vhelp, "f_js/image/help.png");
            this.saveB.onclick = function () {
                self.save();
            };
            this.getB.onclick = function () {
                self.getData();
            };
            this.bb = new BackButton();
            var rcont = cd();
            a(rcont, [this.getB, this.saveB, this.helpB, this.bb]);
            a(this.container, [this.t1, rcont]);
            cla([this.t1], ["w70m", "lg1"]);
            cla([rcont], ["w30m", "lg1"]);
            cla([this.saveB, this.getB, this.helpB, this.bb], ["h25m", "ug1", "f1"]);
            this.initialized = true;
        } catch (e) {
            alert("prog: init: " + e.message);
        }
    };
    this.getName = function () {
        try {
            return trans.get(400);
        } catch (e) {
            alert("prog: getName: " + e.message);
        }
    };
    this.updateStr = function () {
        try {
            this.t1.updateHeader();
            this.saveB.innerHTML = trans.get(1);
            this.getB.innerHTML = trans.get(57);
            this.helpB.updateStr();
            this.bb.updateStr();
        } catch (e) {
            alert("prog: updateStr: " + e.message);
        }
    };
    this.cellChanged = function (id) {
        try {
            if (this.del_block) {
                this.del_block = false;
                return;
            }
            if (this.last_sc === this.t1.sc && this.last_sr === this.t1.sr) {
                switch (this.t1.sc) {
                    case this.ROW.COPE_TIME:
                        var self = this;
                        vtime_edit.prep(this.data[this.t1.sr].cope_duration, 0, INT32_MAX, self, this.t1.sc, 300);
                        showV(vtime_edit);
                        break;
                    case this.ROW.RING_INTERVAL:
                        var self = this;
                        vtime_edit.prep(this.data[this.t1.sr].call_interval, 0, INT32_MAX, self, this.t1.sc, 301);
                        showV(vtime_edit);
                        break;
                    case this.ROW.SMS_INTERVAL:
                        var self = this;
                        vtime_edit.prep(this.data[this.t1.sr].sum_interval, 0, INT32_MAX, self, this.t1.sc, 302);
                        showV(vtime_edit);
                        break;
                }
            }
            this.last_sc = this.t1.sc;
            this.last_sr = this.t1.sr;
        } catch (e) {
            alert("prog: cellChanged: " + e.message);
        }
    };
    this.catchEdit = function (d, k) {
        try {
            switch (k) {
                case this.ROW.COPE_TIME:
                    this.data[this.t1.sr].cope_duration = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, intToTimeStr(this.data[this.t1.sr].cope_duration));
                    break;
                case this.ROW.RING_INTERVAL:
                    this.data[this.t1.sr].call_interval = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, intToTimeStr(this.data[this.t1.sr].call_interval));
                    break;
                case this.ROW.SMS_INTERVAL:
                    this.data[this.t1.sr].sum_interval = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, intToTimeStr(this.data[this.t1.sr].sum_interval));
                    break;
                default:
                    console.log("prog: catchEdit: bad k");
                    break;
            }
        } catch (e) {
            alert("prog: catchEdit: " + e.message);
        }
    };
    this.getData = function () {
        var data = [
            {
                action: ["program", "geta"]
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, "json_raw");
    };
    this.save = function () {
        var arr = this.getChangedData();
        if (arr.length <= 0) {
            return;
        }
        var data = [
            {
                action: ['program', 'save'],
                param: arr
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.SAVE, "json_raw");
    };
    this.resetContProg = function () {
        var data = [
            {
                action: ["controller", "reset"]
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.RESET, "json_udp_acp");
    };
    this.dataRowChanged = function (i) {
        if (
                this.data[i].cope_duration !== this.data_ini[i].cope_duration ||
                this.data[i].call_interval !== this.data_ini[i].call_interval ||
                this.data[i].sum_interval !== this.data_ini[i].sum_interval
                ) {
            return true;
        }
        return false;
    };
    this.getChangedDataId = function () {
        var arr = [];
        for (var i = 0; i < this.data.length; i++) {
            if (this.dataRowChanged(i)) {
                arr.push(this.data[i].id);
            }
        }
        return arr;
    };
    this.getChangedData = function () {
        var arr = [];
        for (var i = 0; i < this.data.length; i++) {
            if (this.dataRowChanged(i)) {
                arr.push(this.data[i]);
            }
        }
        return arr;
    };
    this.dataIniToData = function () {
        for (var i = 0; i < this.data.length; i++) {
            for (var j in this.data[i]) {
                this.data_ini[i][j] = this.data[i][j];
            }
        }
    };
    this.confirm = function (action, d, n) {
        try {
            switch (action) {
                case this.ACTION.GET:
                    cleara(this.data);
                    cleara(this.data_ini);
                    var i = 0;
                    for (i = 0; i < d.length; i++) {
                        this.data.push({
                            sock_port: parseInt(d[i].sock_port),
                            pid_path: d[i].pid_path,
                            sock_buf_size: parseInt(d[i].sock_buf_size),
                            cycle_duration_sec: parseInt(d[i].cycle_duration_sec),
                            cycle_duration_nsec: parseInt(d[i].cycle_duration_nsec),
                            cope_duration: parseInt(d[i].cope_duration),
                            call_interval: parseInt(d[i].call_interval),
                            log_limit: parseInt(d[i].log_limit),
                            sum_interval: parseInt(d[i].sum_interval),
                            phone_number_group_id: parseInt(d[i].phone_number_group_id),
                            cell_peer_id: d[i].cell_peer_id,
                            db_data_path: d[i].db_data_path,
                            db_public_path: d[i].db_public_path,
                            db_log_path: d[i].db_log_path,
                        });
                        this.data_ini.push({
                            sock_port: parseInt(d[i].sock_port),
                            pid_path: d[i].pid_path,
                            sock_buf_size: parseInt(d[i].sock_buf_size),
                            cycle_duration_sec: parseInt(d[i].cycle_duration_sec),
                            cycle_duration_nsec: parseInt(d[i].cycle_duration_nsec),
                            cope_duration: parseInt(d[i].cope_duration),
                            call_interval: parseInt(d[i].call_interval),
                            log_limit: parseInt(d[i].log_limit),
                            sum_interval: parseInt(d[i].sum_interval),
                            phone_number_group_id: parseInt(d[i].phone_number_group_id),
                            cell_peer_id: d[i].cell_peer_id,
                            db_data_path: d[i].db_data_path,
                            db_public_path: d[i].db_public_path,
                            db_log_path: d[i].db_log_path,
                        });
                    }
                    this.redrawTbl();
                    cursor_blocker.disable();
                    break;
                case this.ACTION.SAVE:
                    this.resetContProg();
                    break;
                case this.ACTION.RESET:
                    this.dataIniToData();
                    cursor_blocker.disable();
                    break;
            }

        } catch (e) {
            alert("prog: confirm: " + e.message);
        }

    };
    this.abort = function (action, m, n) {
        try {
            switch (action) {
                case this.ACTION.GET:
                    logger.err(250);
                    cursor_blocker.disable();
                    break;
                case this.ACTION.SAVE:
                    logger.err(257);
                    cursor_blocker.disable();
                    break;
                case this.ACTION.RESET:
                    logger.err(255);
                    cursor_blocker.disable();
                    break;
            }

        } catch (e) {
            alert("prog: abort: " + e.message);
        }
    };
    this.redrawTbl = function () {
        try {
            this.last_sc = -1;
            this.last_sr = -1;
            this.t1.clear();
            for (var i = 0; i < this.data.length; i++) {
                this.t1.appendRow([
                    intToTimeStr(this.data[i].cope_duration),
                    intToTimeStr(this.data[i].call_interval),
                    intToTimeStr(this.data[i].sum_interval)
                ]);
            }
        } catch (e) {
            alert("prog: redrawTbl: " + e.message);
        }
    };
    this.show = function () {
        try {
            clr(this.container, "hdn");
            document.title = this.getName();
            if (this.update) {
                this.getData();
            }
            this.visible = true;
        } catch (e) {
            alert("prog: show: " + e.message);
        }
    };
    this.hide = function () {
        try {
            cla(this.container, "hdn");
            this.visible = false;
        } catch (e) {
            alert("prog: hide: " + e.message);
        }
    };
}
var vedit_prog = new EditProg();
visu.push(vedit_prog);