// 按钮
let buttons_fold = document.querySelectorAll('.button_hidden');

buttons_fold.forEach(element => {
    element.addEventListener('click',event => {
        let target = event.target.nextElementSibling;
        
        if (target.hidden)
            target.hidden = 0;
        else
            target.hidden = 1;
    });
});


// 时间显示
let now = new Date();

let texts_dead_line = document.querySelectorAll('.deadline');

texts_dead_line.forEach(element => {
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
        // else if (day_last === -1)
        //     element.textContent += '已截止';
        // else
        //     element.parentElement.hidden = 1;


        if (day_last > 3)
        element.style.color = '#20db61';
        
        else if (day_last > 1)
        element.style.color = '#ff8222';

        else
        element.style.color = '#ff3e0e';
    }
})


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


// 彩蛋
let version = document.querySelector('.notice');
let time_click_version = 0;

version.addEventListener('click',event => {
    ++time_click_version;
    if (time_click_version === 5) {
        document.body.innerHTML += `
            <div class="text">
                <div class="text_title">广告位招租${version.textContent}</div>
                <div class="text_info">
                <div class="text_info_each">这不是彩蛋</div>
                </div>
            </div>
            `;
    }
});

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
    alert(document.querySelector('#notice').textContent.trim());
    localStorage.setItem('view_last',info_view_last);
}