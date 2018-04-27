<template>
    <div class="nav-tabs-custom">
      <ul class="nav nav-tabs">
        <li class="active" @click="switchTabs('Info')">
          <a href="#info" data-toggle="tab">Info</a>
        </li>
        <li @click="switchTabs('Formulas')"><a href="#formulas" data-toggle="tab">Formulas</a></li>
        <li @click="switchTabs('Text')"><a href="#text" data-toggle="tab">Text</a></li>
        <li @click="switchTabs('More')"><a href="#more" data-toggle="tab">More</a></li>
        <li @click="switchTabs('Activity')"><a href="#activity" data-toggle="tab">Activity</a></li>
        <!-- <li><a href="#formulas" data-toggle="tab">Prep</a></li>
        <li><a href="#formulas" data-toggle="tab">Text</a></li>
         -->
        <li class="pull-right">
          <div class="btn-group">
            <button type="button" class="btn btn-primary" @click="saveHerb()">Save</button>
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu" role="menu">
              <li><a href="#" data-toggle="modal" data-target="#modalHerbUpdate">Edit</a></li>
              <li><a href="#">Save Draft</a></li>
              <li><a href="#">Publish</a></li>
              <li class="divider"></li>
              <li><a href="#" @click="deleteHerb()">Delete</a></li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="tab-content no-padding">
        <HerbTabInfo></HerbTabInfo>
        <HerbTabFormulas></HerbTabFormulas>
        <HerbTabText></HerbTabText>
        <HerbTabMore></HerbTabMore>
        <HerbTabActivity></HerbTabActivity>
      </div>
      <!-- /.tab-content -->
    </div>
    <!-- /.nav-tabs-custom -->
</template>
<script>
  const HerbTabInfo = () => import(/* webpackChunkName: "Content" */ './HerbTabInfo.vue')
  const HerbTabFormulas = () => import(/* webpackChunkName: "Content" */ './HerbTabFormulas.vue')
  const HerbTabText = () => import(/* webpackChunkName: "Content" */ './HerbTabText.vue')
  const HerbTabMore = () => import(/* webpackChunkName: "Content" */ './HerbTabMore.vue')
  const HerbTabActivity = () => import(/* webpackChunkName: "Content" */ './HerbTabActivity.vue')
  import { mapGetters } from 'vuex'
  export default {
    name: 'HerbTabController',
    components: {
      HerbTabInfo,
      HerbTabFormulas,
      HerbTabText,
      HerbTabMore,
      HerbTabActivity
    },
    computed: {
      ...mapGetters({
        herb: 'getHerb', // 1
        currentCategoriesIds: 'getHerbCategoryIds', // 2
        currentFormulaIds: 'getHerbFormulaIds', // 3
        currentPrepIds: 'getHerbPrepIds', // 4
        currentTextIds: 'getHerbTextIds', // 5
        currentFlavourIds: 'getHerbFlavourIds', // 6
        currentNatureIds: 'getHerbNatureIds', // 7
        currentChannelIds: 'getHerbChannelIds', // 8
        currentSpeciesIds: 'getHerbSpecieIds', // 9
        currentCultivationIds: 'getHerbCultivationIds', // 10
        currentCautionIds: 'getHerbCautionIds' // 11
      })
    },
    methods: {
      switchTabs (tabName) {
        this.$store.dispatch('setTabName', tabName)
      },
      saveHerb () {
        let payload = {}
        payload.id = this.herb.id
        // Categories 2
        let categories = []
        this.currentCategoriesIds.map((item, index) => {
          let category = {}
          category.id = item
          category.name = ''
          categories.push(category)
        })
        payload.categories = categories
        // PrepMethods 4
        let preps = []
        this.currentPrepIds.map((item, ind) => {
          let prep = {}
          prep.id = item
          prep.name = ''
          preps.push(prep)
        })
        payload.preparations = preps
        // Formulas 3
        let formulas = []
        this.currentFormulaIds.map((item, ind) => {
          let formula = {}
          formula.id = item
          formula.name = ''
          formulas.push(formula)
        })
        payload.formulas = formulas
        // Texts 5
        let texts = []
        this.currentTextIds.map((item, ind) => {
          let text = {}
          text.id = item
          text.name = ''
          texts.push(text)
        })
        payload.sources = texts
        // Flavours 6
        let flavours = []
        this.currentFlavourIds.map((item, ind) => {
          let flavour = {}
          flavour.id = item
          flavour.name = ''
          flavours.push(flavour)
        })
        payload.flavours = flavours
        // Natures 7
        let natures = []
        this.currentNatureIds.map((item, ind) => {
          let nature = {}
          nature.id = item
          nature.name = ''
          natures.push(nature)
        })
        payload.natures = natures
        // Channels 8
        let channels = []
        this.currentChannelIds.map((item, ind) => {
          let channel = {}
          channel.id = item
          channel.name = ''
          channels.push(channel)
        })
        payload.channels = channels
        // Species 9
        let species = []
        this.currentSpeciesIds.map((item, ind) => {
          let specie = {}
          specie.id = item
          specie.name = ''
          species.push(specie)
        })
        payload.species = species
        // Cultivations 10
        let cultivations = []
        this.currentCultivationIds.map((item, ind) => {
          let cult = {}
          cult.id = item
          cult.name = ''
          cultivations.push(cult)
        })
        payload.cultivations = cultivations
        // Cultivations 11
        let cautions = []
        this.currentCautionIds.map((item, ind) => {
          let caut = {}
          caut.id = item
          caut.name = ''
          cautions.push(caut)
        })
        payload.cautions = cautions
        // Main model fields
        payload.pinyin = this.herb.pinyin
        payload.english_name = this.herb.english_name
        payload.latin_name = this.herb.latin_name
        payload.traditional_chinese = this.herb.traditional_chinese
        payload.simplified_chinese = this.herb.simplified_chinese
        payload.pinyin_ton = this.herb.pinyin_ton
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating...')
        this.$store.dispatch('updateHerbRelations', payload)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      }
    }
  }
</script>
