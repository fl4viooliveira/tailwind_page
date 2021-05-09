<script>

  import Sidebar from "./Sidebar.svelte";

</script>

<div class='flex flex-row'>
  <div class='hidden w-64 lg:block'>
    <Sidebar />
  </div>
  <div class='flex flex-col w-full'>
    <h1 class='mx-auto text-3xl font-bold text-center font-Poppins leading-9 sm:text-5xl '>
      Put anything in your macOS menu bar
    </h1>
    <div class='flex flex-wrap mt-10 xl:flex-nowrap sm:flex-wrap'>
      <div class='w-full justify-self-center'>
        <ul class='w-auto'>
          <li class="items-center p-4 m-6 bg-white rounded-lg shadow-purple">
            <h2> Hundreds of pre-built plugins to choose from </h2>
          </li>
          <li class="items-center p-4 m-6 bg-white rounded-lg shadow-purple">
            <h2> Information you care about, at a glance </h2>
          </li>
          <li class="items-center p-4 m-6 bg-white rounded-lg shadow-purple">
            <h2> Write your own plugins—in any language </h2>
          </li>
        </ul>
      </div>
      <div class='w-full'>
        <div class="flex items-center justify-center -mx-4 lg:pl-8">
          <div class="flex flex-col items-end px-3">
            <img
              class="object-cover mb-6 rounded shadow-lg h-28 sm:h-48 xl:h-56 w-28 sm:w-48 xl:w-56"
              src="./img/xbar-menu-preview.png" alt="xbar"/>
            <img class="object-cover w-20 h-20 rounded shadow-lg sm:h-32 xl:h-40 sm:w-32 xl:w-40"
            src="./img/xbar-website-preview.jpg" alt="xbar" />
          </div>
          <div class="px-3">
            <img class="object-cover w-40 h-40 rounded shadow-lg sm:h-64 xl:h-80 sm:w-64 xl:w-80"
            src="./img/xbar-menu-preview.png" alt="xbar" />
          </div>
        </div>
      </div>
    </div>

    

  </div>
</div>
