import type { RenderOptions } from "@testing-library/react"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { PropsWithChildren, ReactElement } from "react"
import { Provider } from "react-redux"
import type { AppStore, RootState } from "../app/store"
import { makeStore } from "@/app/store"

/**
 * Este tipo estende as opções padrão da função render
 * da React Testing Library. Ele permite configurações adicionais,
 * como especificar um estado inicial do Redux e uma instância personalizada de store.
 */

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  /**
   * Define uma parte específica ou todo o estado inicial para a store do Redux.
   * Isso é particularmente útil para inicializar o estado de forma controlada
   * durante os testes, permitindo que os componentes sejam renderizados
   * com condições de estado pré-determinadas.
   */
  preloadedState?: Partial<RootState>

  /**
   * Permite o uso de uma instância específica de store do Redux em vez de uma
   * store padrão ou global. Essa flexibilidade é útil ao testar componentes
   * com requisitos exclusivos de store ou ao isolar testes do estado global da store.
   * A store personalizada deve ser configurada para corresponder à estrutura e ao middleware
   * da store utilizada pela aplicação.
   *
   * @default makeStore(preloadedState)
   */
  store?: AppStore
}

/**
 * Renderiza o elemento React fornecido com o Redux Provider e uma store personalizada.
 * Esta função é útil para testar componentes conectados à store do Redux.
 *
 * @param ui - O componente ou elemento React a ser renderizado.
 * @param extendedRenderOptions - Opções de configuração opcionais para a renderização.
 * Inclui `preloadedState` para o estado inicial do Redux e `store` para uma instância
 * específica de store do Redux. Quaisquer propriedades adicionais são passadas para a função
 * render da React Testing Library.
 * @returns Um objeto contendo a store do Redux usada na renderização, a API de eventos
 * do usuário para simular interações nos testes, e todas as funções de consulta
 * da React Testing Library para testar o componente.
 */
export const renderWithProviders = (
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) => {
  const {
    preloadedState = {},
    store = makeStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions

  const Wrapper = ({ children }: PropsWithChildren) => (
    // eslint-disable-next-line react/react-in-jsx-scope
    <Provider store={store}>{children}</Provider>
  )

  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}
