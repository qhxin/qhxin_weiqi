window.QHXINWEIQI = (function(){
    
    var pointMap = {}; // 2白 1黑 0空
    var pointMode = 'Normal'; // Normal普通 White全白 Black全黑
    var pointCurrent = 0; // 2白 1黑 0空
    var MaxPointPos;
    var LAST_ONE_EAT_PROTECT = '';
    var LAST_ONE_OUT_PROTECT = '';
    
    function __initView(opt){
        
        var pLine = opt.pLine||19;
        if(pLine>19){
            pLine = 19;
        }
        MaxPointPos = pLine;
        
        var pXing = opt.pXing||{'4_4':1, '4_10':1, '4_16':1, '10_4':1, '10_10':1, '10_16':1, '16_4':1, '16_10':1, '16_16':1};
        var pDefaultWhite = opt.pDefaultWhite||{};
        var pDefaultBlack = opt.pDefaultBlack||{};
        var pCoordinate = (typeof opt.pCoordinate=='undefined' ? true : opt.pCoordinate);
        
        var $qhxinQi = $('#qhxinQi');
        
        // 容器宽度
        var qhxinQi_width = $qhxinQi.parent().width(),
            qhxinQi_html = '';
        $qhxinQi.width(qhxinQi_width);
        $qhxinQi.height(qhxinQi_width);
        
        // 棋盘展示
        var pan_width = Math.floor((qhxinQi_width - pLine) / (pLine + 1)),
            space = pLine - 1,
            space_width = (qhxinQi_width - (pan_width * space + 1))/2;
        
        var view = '<table id="qhxinQiPan" cellpadding="0" cellspacing="0" style="left: '+space_width+'px;top: '+space_width+'px;">';
        for(var i=0; i<space; i++){
            view += '<tr>';
            for(var j=0; j<space; j++){
                view += '<td style="width: '+pan_width+'px;height: '+pan_width+'px;"></td>';
            }
            view += '</tr>';
        }
        view += '</table>';
        qhxinQi_html += ('<div class="qhxinQiUI">'+view+'</div>');
        
        var points_space_width = (qhxinQi_width - (pan_width * pLine))/2;
            points = '<table id="qhxinQiPoints" cellpadding="0" cellspacing="0" style="left: '+points_space_width+'px;top: '+points_space_width+'px;">';
        for(var i=0; i<pLine; i++){
            points += '<tr>';
            var k_i = ""+(i+1);
            if(typeof pointMap[k_i]=='undefined'){
                pointMap[k_i] = {};
            }
            
            for(var j=0; j<pLine; j++){
                var k_j = ""+(j+1);
                    position = k_i+'_'+k_j,
                    point_class = '';
                if(pXing[position]){
                    point_class = 'qhxinXing';
                }
                if(pDefaultWhite[position]){
                    point_class += ' qhxinWhite';
                    pointMap[k_i][k_j] = 2; // 白
                }else
                if(pDefaultBlack[position]){
                    point_class += ' qhxinBlack';
                    pointMap[k_i][k_j] = 1; // 黑
                }else{
                    pointMap[k_i][k_j] = 0; // 空
                }
                points += '<td valign="middle" style="width: '+pan_width+'px;height: '+pan_width+'px;"><div data-pos="'+position+'" class="qhxinPoint '+point_class+'"></div></td>';
            }
            points += '</tr>';
        }
        points += '</table>';
        qhxinQi_html += ('<div class="qhxinQiPoints">'+points+'</div>');
        
        // coordinate
        if(pCoordinate){
            var coordinate = '', m;
            var x = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S'];
            var y = ['19','18','17','16','15','14','13','12','11','10','9','8','7','6','5','4','3','2','1'];
            
            coordinate += '<div id="qhxinQiCoordinate1" style="height: '+points_space_width+'px;left: '+points_space_width+'px;right: '+points_space_width+'px;top: 0px;">';
            for(m=0;m<pLine;m++){
                coordinate += '<div style="line-height:'+points_space_width+'px;height:'+points_space_width+'px;width:'+pan_width+'px;">'+x[m]+'</div>';
            }
            coordinate += '</div>';
            
            coordinate += '<div id="qhxinQiCoordinate2" style="height: '+points_space_width+'px;left: '+points_space_width+'px;right: '+points_space_width+'px;bottom: 0px;">';
            for(m=0;m<pLine;m++){
                coordinate += '<div style="line-height:'+points_space_width+'px;height:'+points_space_width+'px;width:'+pan_width+'px;">'+x[m]+'</div>';
            }
            coordinate += '</div>';
            
            coordinate += '<div id="qhxinQiCoordinate3" style="width: '+points_space_width+'px;left: 0px;top: '+points_space_width+'px;bottom: '+points_space_width+'px;">';
            for(m=0;m<pLine;m++){
                coordinate += '<div style="line-height:'+pan_width+'px;height:'+pan_width+'px;width:'+points_space_width+'px;">'+y[m]+'</div>';
            }
            coordinate += '</div>';
            
            coordinate += '<div id="qhxinQiCoordinate4" style="width: '+points_space_width+'px;right: 0px;top: '+points_space_width+'px;bottom: '+points_space_width+'px;">';
            for(m=0;m<pLine;m++){
                coordinate += '<div style="line-height:'+pan_width+'px;height:'+pan_width+'px;width:'+points_space_width+'px;">'+y[m]+'</div>';
            }
            coordinate += '</div>';
            
            qhxinQi_html += ('<div class="qhxinQiCoordinate">'+coordinate+'</div>');
        }
        
        $qhxinQi.html(qhxinQi_html);
        return $qhxinQi;
    }
    
    function __bindPoint(){
        var $qhxinQiPoints = $('#qhxinQiPoints');
        
        $qhxinQiPoints.off('click').on('click','td', function(){// 落子
            var $this = $(this),
                $qhxinPoint = $this.children('.qhxinPoint'),
                pos = $qhxinPoint.data('pos'),
                pos_arr = pos.split('_'),
                pos_x = pos_arr[0] ? parseInt(pos_arr[0], 10): false,
                pos_y = pos_arr[1] ? parseInt(pos_arr[1], 10): false;
            if(pos_arr.length!=2 || pos_x===false || pos_y===false || pos_x>MaxPointPos || pos_y>MaxPointPos || pos_x<1 || pos_y<1){
                __Log('位置信息['+pos+']错误');
                return;
            }
            if($qhxinPoint.hasClass('qhxinBlack') || $qhxinPoint.hasClass('qhxinWhite')){
                __Log('禁止落子，此位置['+pos+']已有棋子');
                return;
            }
            
            if(pointMode == 'White'){// 摆子模式自由放置，不进行更多检查
                // 落子
                $qhxinPoint.addClass('qhxinWhite');
                pointMap[pos_x][pos_y] = 2;
                pointCurrent = 0;
            }else
            if(pointMode == 'Black'){// 摆子模式自由放置，不进行更多检查
                // 落子
                $qhxinPoint.addClass('qhxinBlack');
                pointMap[pos_x][pos_y] = 1;
                pointCurrent = 0;
            }else{// 对子模式进行更多的检查
                // 如果落子，当前是什么颜色
                var toBeColor = 1,
                    otherColor = 2;
                switch(pointCurrent){
                case 2:
                    toBeColor = 1;
                    otherColor = 2;
                    break;
                case 1:
                    toBeColor = 2;
                    otherColor = 1;
                    break;
                case 0:
                    toBeColor = 1;
                    otherColor = 2;
                    break;
                }
                
                // 预填，如果禁止落子则需恢复
                var origin_point_value = pointMap[pos_x][pos_y];
                pointMap[pos_x][pos_y] = toBeColor;
                
                var this_point_pos = {'x': pos_x,'y': pos_y};
                var others = __findOutTypePoints(this_point_pos, otherColor),
                    checked_others_list = {};
                var checkForbidden = true;
                var clearLastOneEatProtect = true;
                if(others.length > 0){
                    // 周围有对方区块，检查周围对方区块是否有气，如果对方所有区块都有气，则检查是否禁入点，如果存在没气区块，则检查是否打劫
                    for(var i=0;i<others.length;i++){
                        var r = __checkPointsBlockHasAlive(others[i], {}, otherColor);
                        if(r === true){
                            checkForbidden = checkForbidden && true;
                        }else{// 合并这些无气的checked_list，对方可能被提子，非己方无禁入点，不用做禁入点检查，不过需检查打劫
                            checkForbidden = false;
                            checked_others_list = $.extend(true, checked_others_list, r);
                            continue;
                        }
                    }
                }else{
                    // 检查如果当前子落下，周围没有对方区块，则检查禁入点；
                    checkForbidden = true;
                }
                
                if(checkForbidden){
                    // 检查如果当前子落下，己方区块还有没有其他气，如果没有，则为禁入点，不予通过
                    var usToBeEat = __checkPointsBlockHasAlive(this_point_pos, {}, toBeColor);
                    if(usToBeEat!==true){
                        __Log('禁止落子，此位置['+pos+']是己方禁入点');
                        
                        // 恢复预填
                        pointMap[pos_x][pos_y] = origin_point_value;
                        
                        return;
                    }
                }else{// 检查打劫
                    var checked_others_list_count = __jsObjListCount(checked_others_list),
                        OneToBeEat;
                    if(1 == checked_others_list_count){console.log(checked_others_list, LAST_ONE_EAT_PROTECT)
                        if(checked_others_list[LAST_ONE_EAT_PROTECT]){
                            // 想打劫，先找劫材去
                            __Log('禁止落子，想下此位置['+pos+']先找个劫材吧');
                            
                            // 恢复预填
                            pointMap[pos_x][pos_y] = origin_point_value;
                            
                            return;
                        }
                        OneToBeEat = __jsObjListPop(checked_others_list);
                    }
                    
                    // 提子
                    if(checked_others_list_count>0){
                        for(var index = 0; index< checked_others_list_count; index++){
                            var eat_pos = __jsObjListPop(checked_others_list),
                                eat_pos_arr = eat_pos.split('_'),
                                eat_pos_x = eat_pos_arr[0] ? parseInt(eat_pos_arr[0], 10): false,
                                eat_pos_y = eat_pos_arr[1] ? parseInt(eat_pos_arr[1], 10): false,
                                rmClass = (otherColor==2? 'qhxinWhite' :'qhxinBlack' );
                                
                            if(eat_pos_x && eat_pos_y){
                                
                                $('.qhxinPoint.'+rmClass+'[data-pos="'+eat_pos+'"]').removeClass(rmClass);
                                pointMap[eat_pos_x][eat_pos_y] = 0;
                            }
                            
                            delete checked_others_list[eat_pos];
                        }
                    }
                    
                    
                    if(1 == checked_others_list_count){// 对方有个子被吃，如果落子位置的气只有一口且是提子位置，则记录落子位置为劫保护点，此记录在下次落子时清除
                        var fr = __findOnePointAlivePos(this_point_pos);
                        if(fr.length == 1 && fr[0]=== OneToBeEat){
                            LAST_ONE_EAT_PROTECT = pos;
                            clearLastOneEatProtect = false;
                        }
                    }
                    
                }
                
                // 落子
                switch(pointCurrent){
                case 2:
                    $qhxinPoint.addClass('qhxinBlack');
                    pointMap[pos_x][pos_y] = 1;
                    pointCurrent = 1;
                    break;
                case 1:
                    $qhxinPoint.addClass('qhxinWhite');
                    pointMap[pos_x][pos_y] = 2;
                    pointCurrent = 2;
                    break;
                case 0:
                    $qhxinPoint.addClass('qhxinBlack');
                    pointMap[pos_x][pos_y] = 1;
                    pointCurrent = 1;
                    break;
                }
                if(clearLastOneEatProtect){
                    LAST_ONE_EAT_PROTECT = '';
                }
                
            }
            
            
        });
    }
    
    function __Log(txt){
        
        console.log(txt||'');
    }
    
    function __jsObjListCount(arr){
        var c = 0;
        if(typeof arr != 'object'){
            return c;
        }
        for(var i in arr){
            if(arr.hasOwnProperty(i)){
                c++;
            }
        }
        return c;
    }
    
    function __jsObjListPop(arr){// 无序的提取1个
        if(typeof arr != 'object'){
            return undefined;
        }
        for(var i in arr){
            if(arr.hasOwnProperty(i)){
                return i;
            }
        }
        return undefined;
    }
    
    function __setMode(m){
        var mm = {'Normal':1,'White':1, 'Black':1};
        if(typeof mm[m]=='undefined'){
            m = 'Normal';
        }
        pointCurrent = 0;
        pointMode = m;
    }
    
    function __checkPointsBlockHasAlive(pos, checked_list, this_type){
        // 当前点pointMap[pos.x][pos.y]
        var k = ''+pos.x+'_'+pos.y;
        if(checked_list[k]){// 这个点是检查过的，不做再次检查
            return checked_list;
        }
        checked_list[k] = 1;
        if(__checkOnePointHasAlive(pos)){// 当前有气，返回true
            return true;
        }else{
            var brother = __findOutTypePoints(pos, this_type);
            if(brother.length){
                for(var i = 0; i< brother.length; i++){
                    var r = __checkPointsBlockHasAlive(brother[i], checked_list, this_type);
                    if(r === true){//兄弟节点有气直接返回true
                        return true;
                    }else{// 合并这些无气的checked_list
                        checked_list = $.extend(true, checked_list, r);
                        continue;
                    }
                }
                return checked_list;
            }else{// 无气
                return checked_list;
            }
        }
        
    }
    
    function __findOutTypePoints(pos, to_type){
        var r = [];
        if( (pos.x-1)>=1){//上
            if(pointMap[pos.x-1][pos.y]==to_type){
                r.push({'x':pos.x-1,'y':pos.y});
            }
        }
        if( (pos.x+1)<=MaxPointPos){//下
            if(pointMap[pos.x+1][pos.y]==to_type){
                r.push({'x':pos.x+1,'y':pos.y});
            }
        }
        if( (pos.y-1)>=1){//左
            if(pointMap[pos.x][pos.y-1]==to_type){
                r.push({'x':pos.x,'y':pos.y-1});
            }
        }
        if( (pos.y+1)<=MaxPointPos){//右
            if(pointMap[pos.x][pos.y+1]==to_type){
                r.push({'x':pos.x,'y':pos.y+1});
            }
        }
        return r;
    }
    
    function __checkOnePointHasAlive(pos){
        
        if( (pos.x-1)>=1){//上
            if(pointMap[pos.x-1][pos.y]==0){
                return true;
            }
        }
        if( (pos.x+1)<=MaxPointPos){//下
            if(pointMap[pos.x+1][pos.y]==0){
                return true;
            }
        }
        if( (pos.y-1)>=1){//左
            if(pointMap[pos.x][pos.y-1]==0){
                return true;
            }
        }
        if( (pos.y+1)<=MaxPointPos){//右
            if(pointMap[pos.x][pos.y+1]==0){
                return true;
            }
        }
        return false;
    }
    
    function __findOnePointAlivePos(pos){
        var r = [];
        if( (pos.x-1)>=1){//上
            if(pointMap[pos.x-1][pos.y]==0){
                r.push(''+(pos.x-1)+'_'+pos.y);
            }
        }
        if( (pos.x+1)<=MaxPointPos){//下
            if(pointMap[pos.x+1][pos.y]==0){
                r.push(''+(pos.x+1)+'_'+pos.y);
            }
        }
        if( (pos.y-1)>=1){//左
            if(pointMap[pos.x][pos.y-1]==0){
                r.push(''+pos.x+'_'+(pos.y-1));
            }
        }
        if( (pos.y+1)<=MaxPointPos){//右
            if(pointMap[pos.x][pos.y+1]==0){
                r.push(''+pos.x+'_'+(pos.y+1));
            }
        }
        return r;
    }
    
    function __start(opt){
        __initView(opt);
        __setMode(opt.pMode||'');
        __bindPoint();
    }
    
    return {
       'init': __start,
       'initView': __initView,
       'bindPoint': __bindPoint,
       'setMode': __setMode,
    }
})();



$(document).ready(function(){
    
    
    var opt = {
        'pLine': 19, /* 棋盘路数 */
        'pXing': {
            '4_4':1, 
            '4_10':1, 
            '4_16':1, 
            '10_4':1, 
            '10_10':1, 
            '10_16':1, 
            '16_4':1, 
            '16_10':1, 
            '16_16':1
        }, /* 棋盘星位 行_列 */
        'pCoordinate': true, /* 棋盘坐标 */
        'pDefaultWhite': {
            '4_4':1,'16_16':1
        }, /* 初始白棋 */
        'pDefaultBlack': {
            '4_16':1,'16_4':1
        }, /* 初始黑棋 */
        'pMode': 'Normal', /* 落子模式 */
    };
    
    QHXINWEIQI.init(opt);
});
    