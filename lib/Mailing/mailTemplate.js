




function getMailTemplate(_from,_to,_subject,_text,_html)
{
    return{
        from: _from,
        to: _to,
        subject:_subject,
        text: _text,
        html: _html
    }
}

module.exports = getMailTemplate 