declare var tinymce: any;
declare var jQuery: any;
declare var ajaxurl: any;
declare var whenhub: {
    site: string,
    api: string,
    cdn: string
}
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
(function (window, Query) {
    tinymce.create("tinymce.plugins.whenhub_button_plugin", {
        init: (editor, url) => {

            editor.addButton("whenhub", {
                title: "WhenHub",
                cmd: "whenhub_schedules",
                image: `${whenhub.cdn}/img/logo/favicon/favicon-16x16.png`
            });

            editor.addCommand("whenhub_schedules", () => {
                let height = (jQuery(window).height() - 36 - 50) * 0.7;
                let win = editor.windowManager.open({
                    title: '',
                    width: jQuery(window).width() * 0.7,
                    height,
                    inline: 1,
                    id: 'whenhub-dialog',
                    body: [{
                        type: 'container',
                        html: '<div id="whenhub-admin-content"></div>'
                    }],
                    buttons: [{
                        text: 'Close',
                        id: 'whenhub-cancel',
                        onclick: 'close'
                    }],
                    onPostRender: () => {
                        const img = document.createElement('img');
                        img.src = `${whenhub.cdn}/img/logo/logo-185x36.png`;
                        jQuery('#whenhub-dialog-title').prepend(img);
                        jQuery('#whenhub-dialog-title').css('padding', "4px");
                        ReactDOM.render(<App height={height} config={whenhub} editor={editor} window={win} />, document.getElementById('whenhub-admin-content'));
                    }
                });
            });
        },
        getInfo: () => {
            return {
                longname: "WhenHub",
                author: "Jonathan Sheely",
                version: "1"
            };
        }
    });

    tinymce.PluginManager.add("whenhub_button_plugin", tinymce.plugins.whenhub_button_plugin);
})(window, jQuery);