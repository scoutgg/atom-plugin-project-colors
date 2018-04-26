'use babel'

import ProjectColorsView from './project-colors-view'
import {CompositeDisposable} from 'atom'
import config from '../config/config.json'
import {generateColor, shadeColor} from './generate-color'

const pluginName = 'project-colors'

export default {
  config: config,
  subscriptions: null,
  packageView: null,

  activate(state) {
    this.packageView = new ProjectColorsView(state.viewState)
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'project-colors:set-random-project-color': () => this.setRandomProjectColor()
    }))
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'project-colors:set-custom-project-color': () => this.setCustomProjectColor()
    }))
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'project-colors:reset-project-color': () => this.resetProjectColor()
    }))

    this.onDidOpen = atom.workspace.onDidOpen(() => {
      this.initColors()
    })
    this.onDidAddPaneItem = atom.workspace.onDidAddPaneItem(() => {
      setTimeout(() => this.initColors(), 500)
    })
  },
  deactivate() {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.packageView.destroy()
    this.modal.destroy()
    this.onDidOpen.dispose()
    this.onDidAddPaneItem.dispose()
  },
  serialize() {
    return {
      viewState: this.packageView.serialize()
    }
  },
  consumeColorPicker(colorPicker) {
    this.colorPicker = colorPicker
    console.log(this.colorPicker)
  },
  consumeTreeView(treeView) {
    this.treeView = treeView
  },
  resetConfig() {
    atom.config.set(pluginName, {})
  },
  getProjectTabs(projectPath) {
    let els = this.getElements('ul.tab-bar li.tab[data-type="TextEditor"]')
    let ret = []
    let projects = Object.keys(atom.config.settings[pluginName] || {})
      .map(k => k)
    if(projects.length) {
      els.forEach(el => {
        let found = el.querySelector('div.title')
        let path = found && found.dataset && found.dataset.path
        if(projectPath) {
          if(path.includes(`${projectPath}/`)) {
            ret.push({el: el, project: projectPath})
          }
        } else {
          projects.forEach(p => {
            if(path && path.includes(`${p}/`)) {
              ret.push({el: el, project: p})
            }
          })
        }
      })
    }
    return ret
  },
  getElements(selector) {
    return atom
      .views
      .getView(atom.workspace)
      .querySelectorAll(selector)
  },
  initColors() {
    let tabs = this.getProjectTabs()
    tabs.forEach(t => {
      let settings = (atom.config.settings[pluginName][t.project] || {})
      if(settings.color && settings.backgroundColor) {
        t.el.style.boxShadow = 'unset'
        t.el.classList.add('project-colors')
        t.el.style.color = shadeColor(settings.color, '65%')

        t.el.style.backgroundColor = settings.backgroundColor
      }
    })
  },
  resetProjectColor() {
    let project = this.getProject()
    let settings = atom.config.settings[pluginName]
    atom.config.set(pluginName,
      Object.assign(settings || {}, {
        [`${project.path}`]: {}
      })
    )
    let tabs = this.getProjectTabs(project && project.path)
    tabs.forEach(t => {
      t.el.style.color = 'inherit'
      t.el.style.backgroundColor = 'inherit'
    })

  },
  setCustomProjectColor() {
    this.modal = atom.workspace.addModalPanel({
      item: this.packageView.getElement(),
      visible: false,
    })

    this.modal.show()
    // this.colorPicker.open()
  },
  setRandomProjectColor() {
    let project = this.getProject()
    if(project) {
      let randomColor = generateColor()
      let settings = atom.config.settings[pluginName]

      atom.config.set(pluginName,
        Object.assign(settings || {}, {
          [`${project.path}`]: {
            name: project.name,
            backgroundColor: randomColor.backgroundColor,
            color: randomColor.color,
          }
        })
      )
      this.initColors()
    }
  },
  getProject() {
    let paths = this.treeView.selectedPaths()
    if(paths && paths.length) {
      return {
        name: paths[0].split('/').pop(),
        path: paths[0],
      }
    }
  }
}
