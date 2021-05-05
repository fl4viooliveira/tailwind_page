<script>
  let active = false;
  import Sidebar from "./Sidebar.svelte";

</script>

<div class="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-full md:px-24 lg:px-8">
  <div class="relative flex items-center justify-between">
    <a href="/" aria-label="Company" title="Company" class="inline-flex items-center">
      <svg class="w-8 text-deep-purple-accent-400" viewBox="0 0 24 24" stroke-linejoin="round" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" stroke="currentColor" fill="none">
        <rect x="3" y="1" width="7" height="12"></rect>
        <rect x="3" y="17" width="7" height="6"></rect>
        <rect x="14" y="1" width="7" height="6"></rect>
        <rect x="14" y="11" width="7" height="12"></rect>
      </svg>
      <span class="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase mr-15">Company</span>
    </a>
    <img class="h-8 w-8 rounded-full object-center" src="https://avatars.githubusercontent.com/u/101659?v=4" alt="Mat">
    <!-- Mobile menu -->
    <div class:active on:click={() => active= !active} class="lg:hidden">
      <button aria-label="Open Menu" title="Open Menu" class="p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline hover:bg-deep-purple-50 focus:bg-deep-purple-50">
        <svg class="w-5 text-gray-600" viewBox="0 0 24 24">
          <path fill="currentColor" d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"></path>
          <path fill="currentColor" d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"></path>
          <path fill="currentColor" d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"></path>
        </svg>
      </button>
    </div>
  </div>
</div>

  <div class="side-bar items-stretch md:items-center" class:active>
    <Sidebar />
  </div>

<style>
  .side-bar{
    display:none;
  }
  .active{
    display: inline-table;
    width: 100%;
    text-align: right;    
  }

</style>
