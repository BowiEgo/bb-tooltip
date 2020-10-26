import PropTypes from '../util/vue-types';
import animate from '../util/css-animation';
import { Transition } from 'vue';

const root = window;
const originOffset = {
  top: 0,
  left: 0,
};

export default {
  name: 'Popup',

  inheritAttrs: false,

  props: {
    getContainer: PropTypes.func,
    getRootNodeDOM: PropTypes.func,
    getArrowNodeDOM: PropTypes.func,
    visible: PropTypes.bool,
    prefixCls: PropTypes.string,
    placement: PropTypes.string.def('top'),
    arrowWidth: PropTypes.number,
    arrowShadowWidth: PropTypes.number,
    offset: PropTypes.number,
    transitionName: PropTypes.string,
  },

  watch: {
    visible(val) {
      this.$nextTick(() => {
        if (!val) return;
        this.applyStyle(this.getReferenceOffset(), this.getArrowOffset());
      });
    },
  },

  methods: {
    getReferenceOffset() {
      const { $props: props } = this;
      const { placement, visible, offset } = props;

      if (!visible) return originOffset;

      let target = this.getRootNodeDOM();
      return getOffsetRectRelativeToCustomParent(this.$el, target, placement, offset);
    },

    getArrowOffset() {
      const { $props: props, $el } = this;
      const { arrowWidth, arrowShadowWidth, placement } = props;

      return getArrowOffsetByPlacement(arrowWidth, arrowShadowWidth, $el, placement);
    },

    applyStyle(offset, arrowOffset) {
      const { $props: props } = this;
      const { placement, arrowWidth } = props;

      const popupEl = this.$el;
      const arrowEl = this.getArrowNodeDOM();
      const arrowInnerEl = arrowEl.childNodes[0];
      const transformOrigin = getTransformOrigin(popupEl, placement);

      popupEl.style.top = -offset.top + 'px';
      popupEl.style.left = -offset.left + 'px';
      popupEl.style.transformOrigin = transformOrigin;

      arrowEl.style.top = arrowOffset.arrowOutterOffset.top + 'px';
      arrowEl.style.left = arrowOffset.arrowOutterOffset.left + 'px';
      arrowEl.style.width = arrowOffset.arrowOutterOffset.width + 'px';
      arrowEl.style.height = arrowOffset.arrowOutterOffset.width + 'px';

      arrowInnerEl.style.transform = `${arrowOffset.arrowInnerOffset.translate} rotate(45deg)`;
      arrowInnerEl.style.width = arrowWidth + 'px';
      arrowInnerEl.style.height = arrowWidth + 'px';
    },

    getPopupElement() {
      const { $props: props, $slots } = this;
      const { visible, prefixCls, transitionName } = props;

      let transitionProps = {
        appear: true,
        css: false,
        name: transitionName,
      };

      const transitionEvent = {
        onBeforeEnter: () => {
          // el.style.display = el.__vOriginalDisplay
          // this.alignInstance.forceAlign();
        },
        onEnter: (el, done) => {
          // render 后 vue 会移除通过animate动态添加的 class导致动画闪动，延迟两帧添加动画class，可以进一步定位或者重写 transition 组件
          this.$nextTick(() => {
            this.$nextTick(() => {
              this.domEl = el;
              animate(el, `${transitionName}-enter`, done);
            });
          });
        },
        onBeforeLeave: () => {
          this.domEl = null;
        },
        onLeave: (el, done) => {
          animate(el, `${transitionName}-leave`, done);
        },
        onAfterLeave: () => {
          this.applyStyle(originOffset, this.getArrowOffset());
        },
      };

      transitionProps = { ...transitionProps, ...transitionEvent };

      return (
        <Transition {...transitionProps}>
          <div v-show={visible} class={prefixCls}>
            <div class={`${prefixCls}-content`}>{$slots.default && $slots.default()}</div>
          </div>
        </Transition>
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

function getOffsetRectRelativeToCustomParent(element, parent, placement, offset) {
  let elementRect = getBoundingClientRect(element);
  let parentRect = getBoundingClientRect(parent);

  let referenceOffset = {};

  let relativeOffset = {
    top: elementRect.top - parentRect.top,
    left: elementRect.left - parentRect.left,
    bottom: elementRect.top - parentRect.top + elementRect.height,
    right: elementRect.left - parentRect.left + elementRect.width,
  };

  if (['right', 'left'].indexOf(placement) !== -1) {
    referenceOffset.top = relativeOffset.top + elementRect.height / 2 - parentRect.height / 2;
    if (placement === 'left') {
      referenceOffset.left = relativeOffset.right + offset;
    } else {
      referenceOffset.left = relativeOffset.left - parentRect.width - offset;
    }
  } else {
    referenceOffset.left = relativeOffset.left + elementRect.width / 2 - parentRect.width / 2;
    if (placement === 'top') {
      referenceOffset.top = relativeOffset.bottom + offset;
    } else {
      referenceOffset.top = relativeOffset.top - parentRect.height - offset;
    }
  }

  return referenceOffset;
}

function getArrowOffsetByPlacement(arrowWidth, arrowShadowWidth, element, placement) {
  const arrowRotateWidth = Math.sqrt(arrowWidth * arrowWidth * 2) + arrowShadowWidth * 2;
  const elementRect = getBoundingClientRect(element);

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

  return arrowOffsets;
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
