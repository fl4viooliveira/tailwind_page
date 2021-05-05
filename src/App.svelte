<script>

  import Top from './Top.svelte';
  import Main from './Main.svelte';
  import Footer from './Footer.svelte';

</script>

<style>
  :global(body){
    background: #d3d3d373;
    margin:0;
    padding:0;
  }
</style>

  <div class="container mx-auto bg-gradient-to-r from-purple-100 via-purple-300 to-purple-100">
    <Top />
    <Main />
    <Footer />
  </div>


