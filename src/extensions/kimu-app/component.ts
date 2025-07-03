import { KimuComponent } from '../../core/kimu-component';
import { KimuComponentElement } from '../../core/kimu-component-element';

@KimuComponent({
    tag: 'kimu-app',
    name: 'KIMU Main App',
    version: '1.0.0',
    description: 'Main interface container',
    author: 'UnicòVerso',
    icon: '🏠',
    internal: true,
    path: 'kimu-app',
    dependencies: []
})
export class KimuApp extends KimuComponentElement {
}
