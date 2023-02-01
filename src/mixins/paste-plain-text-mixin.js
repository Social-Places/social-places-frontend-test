export const pastePlainTextMixin = {
    methods: {
        pastePlainText(e) {
            if (e.clipboardData == false) {
                return;
            }
            let items = e.clipboardData.items;
            if (items === undefined) {
                return;
            }

            for (let i = 0; i < items.length; i++) {
                let value = items[i];
                if (value.kind.indexOf('file')) {
                    if (value.type.indexOf('text') > -1) {
                        let text = (e.originalEvent || e).clipboardData.getData('text/plain');
                        text = text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
                        if (document.queryCommandSupported('insertText')) {
                            document.execCommand('insertText', false, text);
                        } else {
                            document.execCommand('paste', false, text);
                        }

                        e.preventDefault();
                    }
                    return;
                } else {
                    let text = '';
                    if (e.clipboardData || e.originalEvent.clipboardData) {
                        text = (e.originalEvent || e).clipboardData.getData('text/plain');
                    } else {
                        if (window.clipboardData) {
                            text = window.clipboardData.getData('Text');
                        }
                    }
                    text = text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
                    if (document.queryCommandSupported('insertText')) {
                        document.execCommand('insertText', false, text);
                    } else {
                        document.execCommand('paste', false, text);
                    }
                    e.preventDefault();
                }
            }
        },
    }
}
