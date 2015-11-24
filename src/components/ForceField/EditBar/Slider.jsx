import React from 'react';

export default React.createClass({
    getInitialState: function () {
        return {
            percent: "0%"
        }
    },
    getScrollLeftOffset: function (element) {
        var offset = element.offsetLeft;
        var offsetParent = element.offsetParent;
        while (element.parentNode) {
            element = element.parentNode;
            if (element.scrollLeft) {
                offset -= element.scrollLeft;
            }
            if (offsetParent && element === offsetParent) {
                offset += element.offsetLeft;
                offsetParent = element.offsetParent;
            }
        }
        return offset;
    },
    onTouchStart: function (evt) {
        evt.preventDefault();
        this.state.is_touch = (evt.touches);
        this.state.node = evt.currentTarget;
        this.state.width = this.state.node.clientWidth;
        this.state.offset = this.getScrollLeftOffset(this.state.node);
        document.addEventListener(this.state.is_touch ? 'touchmove' : 'mousemove', this.onTouchMove, true);
        document.addEventListener(this.state.is_touch ? 'touchend' : 'mouseup', this.cleanup, true);
        this.onTouchMove(evt);
    },
    onTouchMove: function (evt) {
        var x;
        if (this.state.is_touch) {
            x = evt.touches[0].clientX - this.state.offset;
        } else {
            x = evt.clientX - this.state.offset;
        }
        console.log(this.state.offset);
        var percent = Math.round((100 / this.state.width) * x);
        if (percent < 0) {
            percent = 0;
        } else if (percent > 100) {
            percent = 100;
        }
        this.setState({
            percent: percent + "%"
        });
    },
    cleanup: function (evt) {
        document.removeEventListener(this.state.is_touch ? 'touchmove' : 'mousemove', this.onTouchMove, true);
        document.removeEventListener(this.state.is_touch ? 'touchend' : 'mouseup', this.cleanup, true);
    },
    render: function () {
        return React.DOM.div({
            onMouseDown: this.onTouchStart,
            onTouchMove: this.onTouchStart
        },
        React.DOM.div({
            className: "slider_bar",
            style: {
                width: this.state.percent
            }
        },
        React.DOM.div({
            className: "slider_label"
        }, this.state.percent)));
    }
});
