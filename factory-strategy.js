// Pattern Factory: to create a field family
function createHealthFields(data = {}, options = {}, loading = true) {
  return {
    operator: {
      type: 'combobox',
      classes: ['col-span-6'],
      label: 'Operadora',
      value: data.operatorId ?? null,
      options: options.operators ?? [],
      identifiers: ['name', 'id'],
      loading,
      error: null
    },
    plan: {
      readonly: true,
      type: 'combobox',
      classes: ['col-span-6'],
      label: 'Plano',
      value: data.planId ?? null,
      options: options.plans ?? [],
      identifiers: ['name', 'id'],
      loading,
      error: null
    },
    cns: {
      type: 'text-field',
      classes: ['col-span-6'],
      label: 'Nº Cartão Nacional de Saúde',
      value: data.cns ?? null,
      maxlength: 20,
      error: null
    },
    inclusionRequest: {
      type: 'date-picker',
      classes: ['col-span-6'],
      label: 'Solicitação de Inclusão',
      value: data.inclusionRequest ?? null,
      info: 'Data que foi solicitado o benefício.',
      error: null
    },
    activation: {
      type: 'date-picker',
      classes: ['col-span-6'],
      label: 'Ativação',
      value: data.activation ?? null,
      info: 'Data que o plano estará vigente.',
      error: null
    },
    cancellation: {
      type: 'date-picker',
      classes: ['col-span-6'],
      label: 'Cancelamento',
      value: data.cancellation ?? null,
      error: null
    },
    benefitCard: {
      type: 'text-field',
      classes: ['col-span-6'],
      label: 'Nº Cartão Benefício',
      value: data.benefitCard ?? null,
      maxlength: 20,
      error: null
    },
    benefitCardDelivered: {
      type: 'check-box',
      classes: ['col-span-6'],
      label: 'Cartão Benefício Entregue',
      value: data.benefitCardDelivered === 'S' ? true : false,
      error: null
    },
    cardReceiptDate: {
      type: 'date-picker',
      classes: ['col-span-6'],
      label: 'Data Recebimento Cartão',
      value: data.cardReceiptDate ?? null,
      error: null
    },
    observations: {
      type: 'text-area',
      classes: ['col-span-12'],
      label: 'Observações',
      value: data.observations ?? null,
      maxlength: 300,
      error: null
    }
  };
}

class HealthBaseForm {
  constructor(store) {
    const data = store.operation?.item;
    const options = store.options ?? {};
    const loading = store.loading?.getOptions ?? true;

    this.alerts = [];

    // -- Use factory
    this.fields = Vue.reactive(createHealthFields(data, options, loading));

    // -- Pattern Strategy: for grouping families of algorithms (in this case, validations)
    this.fieldHandlers = {
      operator: () => this.updatePlansByOperator(store)
    };
  }
          
  // -- Strategies
  updatePlansByOperator(store) {
    const allPlans = store.options?.plans || [];
    const selectedOperatorId = this.fields.operator.value;
    const filteredPlans = allPlans.filter(p => p.operatorId === selectedOperatorId);

    Object.assign(this.fields.plan, {
      options: filteredPlans,
      readonly: filteredPlans.length === 0,
      value: null
    });
  }

  setOptions({ options }) {
    if (this.fields.operator) {
      this.fields.operator.options = options.operators ?? [];
      this.fields.operator.loading = false;
    }

    if (this.fields.plan) {
      this.fields.plan.options = options.plans ?? [];
      this.fields.plan.loading = false;
    }
  }

  values() {
    return {
      operator: this.fields.operator.value,
      plan: this.fields.plan.value,
      cns: this.fields.cns.value,
      inclusionRequest: this.fields.inclusionRequest.value,
      activation: this.fields.activation.value,
      cancellation: this.fields.cancellation.value,
      benefitCard: this.fields.benefitCard.value,
      benefitCardDelivered: this.fields.benefitCardDelivered.value ? 'S' : 'N',
      cardReceiptDate: this.fields.cardReceiptDate.value,
      observations: this.fields.observations.value
    };
  }
}

class HealthCreateForm extends HealthBaseForm {
  constructor(store = {}) {
    super(store);

    this.tabs = [{ key: 'health', name: 'Saúde' }];
    const favoriteTab = JSON.parse(localStorage.getItem('whscadusuariosnew'));
    this.selectedTab = this.tabs.map(t => t.key).includes(favoriteTab?.tab)
      ? favoriteTab.tab
      : this.tabs[0].key;
  }
}

class HealthEditForm extends HealthBaseForm {
  constructor(store = {}) {
    super(store);
  }

  values(store) {
    const data = store.operation?.item ?? {};
    return {
      healthBenefitId: data.id,
      ...super.values()
    };
  }
}
