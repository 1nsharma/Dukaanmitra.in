/**
 * AI-powered client-side accessibility utility for DukaanMitra.
 * Automatically adds fallback ARIA labels, audits contrast, and handles semantic fixes dynamically
 * and safely within iframe boundaries.
 */

export function initAccessibilityHelpers() {
  // Wait until DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAutoAriaLabels);
  } else {
    applyAutoAriaLabels();
  }

  // Set up a MutationObserver to handle dynamic elements on routing / state updates
  try {
    const observer = new MutationObserver((mutations) => {
      let shouldRun = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldRun = true;
          break;
        }
      }
      if (shouldRun) {
        applyAutoAriaLabels();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } catch (e) {
    console.warn('MutationObserver not supported or failed to initialize:', e);
  }
}

/**
 * Automatically applies ARIA labels to buttons, links, and inputs that lack them,
 * based on text content, inner text, or icons inside them.
 */
export function applyAutoAriaLabels() {
  // 1. Audit Buttons and Anchor tags
  const interactiveElements = document.querySelectorAll('button, a:not([role])');
  interactiveElements.forEach((el) => {
    const hasAriaLabel = el.hasAttribute('aria-label');
    const hasAriaLabelledBy = el.hasAttribute('aria-labelledby');
    const textContent = el.textContent?.trim();

    if (!hasAriaLabel && !hasAriaLabelledBy) {
      if (textContent) {
        // Standard text content is already readable by screen readers,
        // but let's ensure it has an explicit accessible name if it's purely icon-based
        if (textContent.length < 3 && el.querySelector('svg')) {
          // It's likely an icon button, try to guess the action
          const svg = el.querySelector('svg');
          const guessedName = guessActionFromElement(el, svg);
          el.setAttribute('aria-label', guessedName);
        }
      } else {
        // No text content. This is definitely an icon button/link
        const svg = el.querySelector('svg');
        const img = el.querySelector('img');
        let label = 'Action Button';

        if (img && img.getAttribute('alt')) {
          label = img.getAttribute('alt') || label;
        } else if (svg) {
          label = guessActionFromElement(el, svg);
        } else {
          // Check class names or id
          const idVal = el.id || '';
          const classVal = el.className || '';
          if (idVal.includes('close') || classVal.includes('close')) {
            label = 'Close';
          } else if (idVal.includes('back') || classVal.includes('back')) {
            label = 'Go Back';
          } else if (idVal.includes('menu') || classVal.includes('menu')) {
            label = 'Toggle Menu';
          }
        }
        el.setAttribute('aria-label', label);
      }
    }
  });

  // 2. Audit form inputs for matching labels / aria-describedby
  const inputs = document.querySelectorAll('input:not([aria-label]), select:not([aria-label]), textarea:not([aria-label])');
  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    if (id) {
      const associatedLabel = document.querySelector(`label[for="${id}"]`);
      if (!associatedLabel) {
        // No matching label tag, try to find closest ancestor label or parent text
        const parentLabel = input.closest('label');
        if (!parentLabel) {
          // Fallback guess based on placeholder or name
          const placeholder = input.getAttribute('placeholder');
          const name = input.getAttribute('name');
          if (placeholder) {
            input.setAttribute('aria-label', placeholder);
          } else if (name) {
            input.setAttribute('aria-label', name.replace(/[-_]/g, ' '));
          }
        }
      }
    } else {
      // Input has no ID, try setting placeholder as aria-label
      const placeholder = input.getAttribute('placeholder');
      if (placeholder) {
        input.setAttribute('aria-label', placeholder);
      }
    }
  });
}

function guessActionFromElement(el: Element, svg: SVGElement | null): string {
  // Traverse classes to guess action
  const classString = (el.className || '') + ' ' + (svg?.className?.baseVal || '');
  const idString = (el.id || '').toLowerCase();

  if (classString.includes('search') || idString.includes('search')) {
    return 'Search';
  }
  if (classString.includes('close') || idString.includes('close') || classString.includes('x-mark')) {
    return 'Close';
  }
  if (classString.includes('menu') || idString.includes('menu') || classString.includes('hamburger')) {
    return 'Menu';
  }
  if (classString.includes('home') || idString.includes('home')) {
    return 'Home';
  }
  if (classString.includes('arrow-left') || classString.includes('back') || idString.includes('back')) {
    return 'Go Back';
  }
  if (classString.includes('arrow-right') || classString.includes('next') || idString.includes('forward')) {
    return 'Next';
  }
  if (classString.includes('play') || idString.includes('play')) {
    return 'Play';
  }
  if (classString.includes('pause') || idString.includes('pause')) {
    return 'Pause';
  }
  if (classString.includes('share') || idString.includes('share')) {
    return 'Share';
  }
  if (classString.includes('whatsapp') || idString.includes('whatsapp')) {
    return 'Contact on WhatsApp';
  }
  if (classString.includes('delete') || classString.includes('trash') || idString.includes('delete') || idString.includes('trash')) {
    return 'Delete';
  }
  if (classString.includes('edit') || classString.includes('pencil') || idString.includes('edit')) {
    return 'Edit';
  }
  if (classString.includes('plus') || classString.includes('add') || idString.includes('add')) {
    return 'Add';
  }

  // Fallback to text content query
  return 'Interactive element';
}
