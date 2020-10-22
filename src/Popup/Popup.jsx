import PropTypes from '../util/vue-types';

const root = window;

export default {
  name: 'Popup',

  props: {
    getContainer: PropTypes.func,
    getRootNodeDOM: PropTypes.func,
    getArrowNodeDOM: PropTypes.func,
    visible: PropTypes.bool,
    prefixCls: PropTypes.string,
    placement: PropTypes.string.def('top'),
    arrowWidth: PropTypes.number,
    arrowShadowWidth: PropTypes.number,
  },

  watch: {
    visible(val) {
      this.$nextTick(() => {
        this.applyStyle(this.getOffset(), this.getArrowOffset());
      });
    },
  },

  methods: {
    getOffset() {
      const { $props: props } = this;
      const { placement, visible } = props;

      if (!visible) {
        return {
          top: 0,
          left: 0,
        };
      }

      let target = this.getRootNodeDOM();
      let offset = getOffsetRectRelativeToCustomParent(this.$el, target, placement);

      return offset;
    },

    getArrowOffset() {
      const { $props: props, $el } = this;
      const { arrowWidth, arrowShadowWidth, placement, visible } = props;
      const arrowRotateWidth = Math.sqrt(arrowWidth * arrowWidth * 2) + arrowShadowWidth * 2;

      let elementRect = getBoundingClientRect($el);

      let arrowOutterOffset = {},
        arrowInnerOffset = {};

      arrowOutterOffset.width = arrowRotateWidth;

      if (['right', 'left'].indexOf(placement) !== -1) {
        arrowOutterOffset.top = elementRect.height / 2 - arrowRotateWidth / 2;
        if (placement === 'left') {
          arrowOutterOffset.left = elementRect.width;
          arrowInnerOffset.translate = `translateX(-${arrowRotateWidth / 2}px)`;
        } else {
          arrowOutterOffset.left = -arrowRotateWidth;
          arrowInnerOffset.translate = `translateX(${arrowRotateWidth / 2}px)`;
        }
      } else {
        arrowOutterOffset.left = elementRect.width / 2 - arrowRotateWidth / 2;
        if (placement === 'top') {
          arrowOutterOffset.top = elementRect.height;
          arrowInnerOffset.translate = `translateY(${-arrowRotateWidth / 2}px)`;
        } else {
          arrowOutterOffset.top = -arrowRotateWidth;
          arrowInnerOffset.translate = `translateY(${arrowRotateWidth / 2}px)`;
        }
      }

      let arrowOffsets = {
        arrowOutterOffset,
        arrowInnerOffset,
      };

      console.log(arrowOffsets);
      return arrowOffsets;
    },

    applyStyle(offset, arrowOffset) {
      const { $props: props } = this;
      const { placement } = props;

      const popupEl = this.$el;
      const arrowEl = this.getArrowNodeDOM();
      const arrowInnerEl = arrowEl.childNodes[0];
      console.log('arrowEl', arrowEl, arrowInnerEl);
      const transformOrigin = getTransformOrigin(popupEl, placement);

      popupEl.style.top = -offset.top + 'px';
      popupEl.style.left = -offset.left + 'px';
      popupEl.style.transformOrigin = transformOrigin;

      arrowEl.style.top = arrowOffset.arrowOutterOffset.top + 'px';
      arrowEl.style.left = arrowOffset.arrowOutterOffset.left + 'px';

      console.log(`rotate(45deg) ${arrowOffset.arrowInnerOffset.translate}px`);
      arrowInnerEl.style.transform = `${arrowOffset.arrowInnerOffset.translate} rotate(45deg)`;
    },

    getPopupElement() {
      const { $props: props, $slots } = this;
      const { visible, prefixCls } = props;

      return (
        <div v-show={visible} class={prefixCls}>
          <div class={`${prefixCls}-content`}>{$slots.default && $slots.default()}</div>
        </div>
      );
    },
  },

  render() {
    return this.getPopupElement();
  },
};

function getOuterSizes(element) {
  // NOTE: 1 DOM access here
  var _display = element.style.display,
    _visibility = element.style.visibility;
  element.style.display = 'block';
  element.style.visibility = 'hidden';
  var calcWidthToForceRepaint = element.offsetWidth;

  // original method
  var styles = root.getComputedStyle(element);
  var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  var result = { width: element.offsetWidth + y, height: element.offsetHeight + x };

  // reset element styles
  element.style.display = _display;
  element.style.visibility = _visibility;
  return result;
}

function getBoundingClientRect(element) {
  var rect = element.getBoundingClientRect();

  // whether the IE version is lower than 11
  var isIE = navigator.userAgent.indexOf('MSIE') != -1;

  // fix ie document bounding top always 0 bug
  var rectTop = isIE && element.tagName === 'HTML' ? -element.scrollTop : rect.top;

  return {
    left: rect.left,
    top: rectTop,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.right - rect.left,
    height: rect.bottom - rectTop,
  };
}

function getOffsetRectRelativeToCustomParent(element, parent, placement) {
  let elementRect = getBoundingClientRect(element);
  let parentRect = getBoundingClientRect(parent);

  let referenceOffset = {};

  let offset = {
    top: elementRect.top - parentRect.top,
    left: elementRect.left - parentRect.left,
    bottom: elementRect.top - parentRect.top + elementRect.height,
    right: elementRect.left - parentRect.left + elementRect.width,
  };

  if (['right', 'left'].indexOf(placement) !== -1) {
    referenceOffset.top = offset.top + elementRect.height / 2 - parentRect.height / 2;
    if (placement === 'left') {
      referenceOffset.left = offset.right;
    } else {
      referenceOffset.left = offset.left - parentRect.width;
    }
  } else {
    referenceOffset.left = offset.left + elementRect.width / 2 - parentRect.width / 2;
    if (placement === 'top') {
      referenceOffset.top = offset.bottom;
    } else {
      referenceOffset.top = offset.top - parentRect.height;
    }
  }

  return referenceOffset;
}

function getTransformOrigin(element, placement) {
  const rect = element.getBoundingClientRect();
  let transformOrigin = {
    top: '50%',
    left: '50%',
  };
  if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
    transformOrigin.top = `${rect.height}px`;
  } else if (placement.indexOf('Top') >= 0 || placement.indexOf('bottom') >= 0) {
    transformOrigin.top = `${0}px`;
  }
  if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
    transformOrigin.left = `${rect.width}px`;
  } else if (placement.indexOf('right') >= 0 || placement.indexOf('Left') >= 0) {
    transformOrigin.left = `${0}px`;
  }
  return `${transformOrigin.left} ${transformOrigin.top}`;
}
