Zepto(function($){
    colorPicker();

    let ele_MainNav = $(".section-main-design .aside-left li");

    ele_MainNav.on('click', link => {

        if(link.target.innerText === 'Products') products(link.target.innerText, 'list.json');
        $(".aside-right").html("<h2>"+link.target.innerText+"</h2>");

        ele_MainNav.forEach(mainProd => (link.target.id === mainProd.id) ? $(mainProd).addClass('active'): $(mainProd).removeClass('active'));

        $("body").on('click','.wrap-products img', img => products(null, img.target.id+'.json'))
    });
});

let colorPicker = () => {
    let aColor = [{name: 'Black', value: '#222222' }, {name: 'Accent', value: '#00bfff' }, {name: 'Darker', value: '#3a3a3a'}, {name: 'Lighter', value: '#e9e9e9'}];
    aColor.forEach((color, i) => {
        $(".section-body-colors .m-right").append("<div><p><small><strong>"+color.name +"</strong>" + " <strong class=col-"+color.name+">"+color.value+"</small></p></strong>"+ "<input class='colors' id="+color.name+" type='color' value="+color.value+"></div>")
    });

    $(".colors").focus($.proxy((event) => {
        let status = $(event.currentTarget);
        let col = $(".col-"+status[0].id);
        $(".colors").forEach((c) => {
            if(col[0].className === "col-"+c.id) col.html(c.value)
        });
    }));

};

let addToCart = (e_prodInfo) => {

    let qty = $("#item-"+e_prodInfo.id+ " .qty");
    let iInc = parseInt(qty.text(), 10)+1;

    (!$("#item-"+e_prodInfo.id).length) ?
        $(".wrap-addToCart").append("<li id=item-"+e_prodInfo.id+">" + "<img src=."+e_prodInfo.image+">" + "<small class='product'><p>"+e_prodInfo.name+" </p><p><span class='price'>"+e_prodInfo.price+"</span>  ("+e_prodInfo.currency+")</p>"+ "<p>Qty : <span class='qty'>1</span></p></small>" + "<button class=remove-"+e_prodInfo.id+">X</button></li>")
    : qty.html(iInc);
    $(".remove-"+e_prodInfo.id).unbind().on('click', () => removeToCart(e_prodInfo));
    countCart();
};

let removeToCart = (e_prodInfo) => {
    let qty = $("#item-"+e_prodInfo.id+ " .qty");

    if (!$("#item-"+e_prodInfo.id).length) return;

    (qty.text() != 1) ?
        qty.html(parseInt(qty.text(), 10)-1)
    : $("#item-"+e_prodInfo.id).remove();
    countCart();
};

let countCart = () => {
    let iCounter = 0;
    let iTotal = 0;
    $('.product').forEach(product => {
        iCounter += Number(product.children[2].children[0].innerText);
        iTotal += Number(product.children[1].children[0].innerText) * Number(product.children[2].children[0].innerText);
    });

    $(".Shopping-cart #counter").html("("+iCounter+")");
    $(".Shopping-cart #total").html(iTotal+ " SEK" );
};

let products = (sText, sUrl) => {
    $.ajax({
        type: 'GET',
        url: './data/'+sUrl,
        dataType: 'json',
        timeout: 300,
        success: (e_pros) => {
            if (e_pros.length > 0) {
                $(".aside-right").html("<h2>"+sText+"</h2>");
                e_pros.forEach(pro => $(".aside-right").append("<div class='wrap-products align-block'><img id="+pro.id+" src=."+pro.thumbnail+"><p>"+pro.name+"</p>"+pro.price+' '+pro.currency+"</div>"));
            } else {
                $(".aside-right").html("<div class='wrap-products single'>" + "<h2>"+e_pros.name+"</h2>" + "<img id="+e_pros.id+" src=."+e_pros.thumbnail+">" + "<p>"+e_pros.name+"</p>"+e_pros.price+' ' + e_pros.currency + "<p>"+e_pros.description+"</p>"+ "<button class='addToCart'>Add to cart</button>"+ "</div>");
                $(".addToCart").on('click', () => addToCart(e_pros));
            }
        }
    });
};