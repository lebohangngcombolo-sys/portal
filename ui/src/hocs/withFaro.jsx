/**
 * Faro telemetry HOC.
 *
 * Wraps a component so that render-phase errors are captured with the
 * component's name and current route. Also pushes a `component_view`
 * event on mount (once).
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { faro } from '../faro/logger.js';

export function withFaro(Component, name = null) {
  const componentName = name || Component.displayName || Component.name || 'Anonymous';

  function FaroWrapped(props) {
    const location = useLocation();

    useEffect(() => {
      faro.api?.pushEvent('component_view', {
        attributes: { component: componentName, route: location.pathname },
      });
    }, [location.pathname]);

    try {
      return <Component {...props} />;
    } catch (error) {
      faro.api?.pushError(error, {
        context: { component: componentName, route: location.pathname },
      });
      throw error;
    }
  }

  FaroWrapped.displayName = `withFaro(${componentName})`;
  return FaroWrapped;
}