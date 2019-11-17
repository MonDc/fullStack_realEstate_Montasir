// navbar will be closssed by clicking outside the dropdown list

$(document).ready(function () {
    $(document).click(function (event) {
        var clickOutside = $(event.target);

        var addClass = $(".navbar-collapse").hasClass("show"); // weahter the navbarcollaps adding .show?

        if (addClass && !clickOutside.hasClass("navbar-toggler")) {
            $(".navbar-toggler").click()
        }

    })

    // scrolling smoothly to our our (#links)an alternative to html scroll behaviour: smooth

    $("a").on("click", function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            let hash = this.hash;
            $("html,body").animate({
                scrollTop: $(hash).offset().top,
            }, 600, 'swing', function () {
                window.location.hash = hash;
            })
        }
    })



    // map
    var mymap = L.map('mapid').setView([53.552411, 10.009873], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibW8tZGMiLCJhIjoiY2p1aGU0Ymh3MHo2azQ0cDB1ZXN1b3RnZyJ9.eGNdO1YzU3YQTG1B9fTvzw'
    }).addTo(mymap);

    // var point = [53.555662, 10.009368];
    // var myMarker = L.marker(point)
    // myMarker.addTo(map)
    var montasirIcon = L.icon({
        iconUrl: 'img/marker1.png',
        shadowUrl: 'img/marker1.png',
        iconAnchor: [53.555662, 10.009368]
    })

    var marker = L.marker([53.555662, 10.009368], {
        icon: montasirIcon
    }).addTo(mymap);
    //var popup = L.popup();

    marker.bindPopup(
        "<h3>DCI Hamburg</h3> <img style='margin:0;opacity:1' src='img/kar.png'><img style='margin:0;opacity:1' src='img/wis.jpg'><img style='margin:0;opacity:1' src='img/bas.png'><img style='margin:0;opacity:1' src='img/mont.png'> <p style='color:green;'>We are right Here!<span class='error_number' style='color:#526865; font-size: 30px;'>" +
        "   " + "&copf;</span><span style='color:#676468;font-size:18px;'>ode  &Bopf;reakers</span></p>"
    )
    // .openPopup(); مباشر 

    //&empty;  &sqsub; &copf; 



    // function onMapClick(e) {
    //     popup
    //         .setLatLng(e.latlng)
    //         .setContent("<h3>DCI's CODE BREAKERS</h3> <br> <p style='color:green;'>We are right Here!</p>")
    //         .openOn(mymap);
    // }

    //mymap.on('click', onMapClick);


    // end map




    // start team


    $("#team-slider").owlCarousel({
        items: 3,
        autoplay: true,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 2
            },
            768: {
                items: 3
            }

        }

    });



    // end team










    // this for document.ready
});



// more links

function showModal(num) {
    switch (num) {
        case 0:
            $('#exampleModal0').modal('show');
            break;

        case 1:
            $('#exampleModal1').modal('show');
            break;

        case 2:
            $('#exampleModal2').modal('show');
            break;

        case 3:
            $('#exampleModal3').modal('show');
            break;


            break;
        case 4:
            $('#exampleModal4').modal('show');
            break;
        default:
    }

}


//  end more links



// contact us

var x;
$(function () {
    x = $(".cont").swyftCallback({
        api: {
            url: 'https://api.com/contact',
            custom: [{
                name: 'api_key',
                value: '123456789'
            }, ],
            param: {
                success: {
                    name: 'result',
                    value: 'success'
                },
                message: 'message'
            },
        },
        data: {
            form_method: 'get',
        },
        appearance: {
            custom_button_class: ['right', 'wow', 'animated', 'pulse', 'infinite'],
            ripple_effect: 2,
            show_toggle_button_text: false, // true
        },
        //custom_button_data: [['wow-duration', '4s']],
        text_vars: {
            popup_title: "Get in Touch ",
            popup_body: "Please leave your number and email  here. We will contact you ",
            send_button_text: "Send",
            wrong_input_text: "Wrong input",

            status_success: "Success",
            status_error: "Server error",

            toggle_button_text: 'Let\'s talk!'
        },
        input: {
            fields: [{
                    name: 'name',
                    label: 'Your Name',
                    field_name: 'name',
                    data_field_type: 'name',
                    type: 'text',
                    placeholder: 'Enter your Name',
                    max_length: 50,
                    required: true
                },

                {
                    name: 'phone',
                    label: 'Phone',
                    field_name: 'phone',
                    data_field_type: 'phone',
                    placeholder: '000-000-000',
                    required: true
                },
                {
                    name: 'email',
                    label: 'Email',
                    field_name: 'email',
                    data_field_type: 'email',
                    type: 'text',
                    placeholder: 'Enter your Email',
                    max_length: 50,
                    required: true
                },
            ],
            //     agreements: [{
            //             field_name: 'agreement_1',
            //             short: 'Short',
            //             long: 'Long',
            //             readmore: 'More',
            //             readless: 'Less',
            //         },
            //         {
            //             field_name: 'agreement_2',
            //             short: 'Short2',
            //             long: 'Long2',
            //             readmore: 'More',
            //             readless: 'Less',
            //         },
            //         {
            //             field_name: 'agreement_3',
            //             short: 'Short3',
            //             long: 'Long3',
            //             readmore: 'More',
            //             readless: 'Less',
            //             checked: false
            //         }
            //     ],
            data_dictionary: {
                'api_key': 'key',
                'sc_fld_telephone': 'phone'
            }
        },
        // body_content: [{
        //     short: 'Short',
        //     long: 'Long',
        //     readmore: 'More',
        //     readless: 'Less',
        // }],
        callbacks: {
            onShow: {
                function: function () {
                    console.log('popup: open')
                },
            },
            onHide: {
                function: function () {
                    console.log('popup: close')
                },
            },
            onSend: {
                success: {
                    function: function (input) {
                        console.log(input)
                    },
                },
                error: {
                    function: function (input) {
                        console.log(input)
                    },
                }
            }
        }
    });
});

// end contact us