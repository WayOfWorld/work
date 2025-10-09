// 时间显示,种数统计
let now = new Date();

let n_notice = 0;
let n_warn = 0;

let texts_dead_line = document.querySelectorAll('.deadline');

texts_dead_line.forEach(element => {
    if (!element.checkVisibility()) return;

    var dead_line = new Date();

    var re_time = /(?:(\d{1,4})\/)?(\d+)\/(\d{1,2})/;

    var text_dead_line = re_time.exec(element.textContent);

    if (!text_dead_line) return;
    
    if (text_dead_line[1])
        dead_line.setFullYear(Number(text_dead_line[1]));
    dead_line.setDate(1);
    dead_line.setMonth(Number(text_dead_line[2])-1);
    dead_line.setDate(Number(text_dead_line[3]));

    var day_last = Math.floor((dead_line-now)/1000/3600/24);

    if (element.textContent.includes('/')) {
        if (day_last > 0)
            element.textContent = `${element.textContent}剩${day_last}天`;
        else if (day_last === 0)
            element.textContent += '截止日';
        else if (day_last < 0)
            element.textContent += '已截止';

        if (day_last > 3)
            element.style.color = '#20db61';
        else if (day_last > 1) {
            element.style.color = '#ff8222';
            n_notice++;
        }
        else {
            element.style.color = '#ff3e0e';
            n_warn++;
        }
    }
})

document.querySelector('#todo_number_notice').textContent = n_notice;
document.querySelector('#todo_number_warn').textContent = n_warn;

// 概况条
let overview_bar = document.querySelector('.overview_bar');
let text_infos = document.querySelectorAll('.text_info_each:not([hidden])');

/**
    @param {element} bar_part
*/
function intersection_callback (bar_part) {
    /**
    @param {IntersectionObserverEntry[]} entries
    */
    function func(entries) {
        if (entries[0].isIntersecting)
            bar_part.setAttribute('selected','');
        else
            bar_part.removeAttribute('selected');
    }

    return func;
}

text_infos.forEach(element => {
    let bar_part = document.createElement('div');
    
    let each_deadline = element.querySelector('.deadline');

    if (each_deadline)
        bar_part.style.backgroundColor = window.getComputedStyle(each_deadline).color;

    //概况条选中
    const observer = new IntersectionObserver(intersection_callback(bar_part),{threshold:1});
    observer.observe(element);

    overview_bar.appendChild(bar_part);
})

//种数统计
document.querySelector('#todo_number_total').textContent = text_infos.length;

//展开(新按钮)
let fold_dis = document.querySelectorAll('.fold_dis');

fold_dis.forEach(element => {
    let target = element.nextElementSibling;
    let time_lastclick = Date.now();

    target.hidden = 1;

    element.addEventListener('click',event => {
        if (element.getAttribute('unfold')==='1') {
            if ((Date.now() - time_lastclick) > 750) { // 毫秒间隔
                time_lastclick = Date.now();
                return;
            }

            element.setAttribute('unfold','0');
        }
        else
            element.setAttribute('unfold','1');

        [target.textContent,element.textContent] = [element.textContent,target.textContent];

    });
});

//展开(日志)
let fold_log = document.querySelector('.news_button');
let topic = document.querySelector('.topic');

topic.addEventListener('click',event => {
    if (event.target.className != "fold_dis")
        if (topic.getAttribute('fold') == null)
            topic.setAttribute('fold','');
        else
            topic.removeAttribute('fold');
});

// 优化链接
let a = document.querySelectorAll('a');

a.forEach(element => {
    element.target = "_blank";
})

// 删除没有内容的作业
document.querySelectorAll('.text').forEach(element => {
    if(element.querySelectorAll('.text_info_each:not([hidden])').length === 0)
        element.hidden = 1;
})


// 格式控制
document.querySelectorAll('.formate').forEach(element => {

    if (document.querySelector(`meta[name='${element.textContent}']`))
        element.textContent = document.querySelector(`meta[name='${element.textContent}']`).getAttribute('content');
})

// 提示
let info_view_last = [document.querySelector('meta[name="version"]').getAttribute('content'),document.querySelector('meta[name="revised"]').getAttribute('content')].join('_');

if (localStorage.getItem('view_last') != info_view_last) {
    localStorage.setItem('view_last',info_view_last);
}

// 菜单选中
let menu_info = document.querySelector('.menu_info');

let menu_funcs = menu_info.querySelectorAll('.func');
let menu_selected;

let egg_loc = document.querySelector('#egg_loc');
let egg_html = '<iframe style="width: 100%; height: 100%;" src="//player.bilibili.com/player.html?isOutside=true&aid=80433022&bvid=BV1GJ411x7h7&cid=137649199&p=1&danmaku=0&autoplay=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="false"></iframe>'

if (window.innerHeight > window.innerWidth)
    egg_loc.hidden = true;

function menu_select(id) {
    menu_info.querySelectorAll('.menu_info_each').forEach(element => element.hidden = true);

    egg_loc.innerHTML = '';

    if (id) {
        if (id == menu_selected) {
            menu_select(null);
            return;
        }

        if (id == 'egg')
            egg_loc.innerHTML = egg_html;

        menu_info.setAttribute('selected','');
        menu_info.querySelector(`#${id}`).hidden = false;
        menu_selected = id;
    } else {
        menu_info.removeAttribute('selected');
        if (menu_selected)
            menu_info.querySelector(`#${menu_selected}`).hidden = false;
        menu_selected = null;
    }

    menu_funcs.forEach(element => {
        if (id && element.getAttribute('link') == id)
            element.setAttribute('selected','');
        else
            element.removeAttribute('selected');
    });
}
menu_select(null);

menu_info.querySelectorAll('.func').forEach(element => {
    element.addEventListener('click',event => {
        menu_select(element.getAttribute('link'));
    })
});