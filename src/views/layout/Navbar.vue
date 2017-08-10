<template>
    <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <levelbar></levelbar>
        <tabs-view></tabs-view>
        <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>
        <screenfull class='screenfull'></screenfull>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAB/CAMAAAAeoYYfAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQAAAP////////////////3z6v////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////O/if///////+23gfC7hf3OmvXDjv///////////+23gf3Omv3OmvzLl/3Omu23ge23ge23gf3QoP3Omv3OmvXDjf39/f///2JFPP3MnBIREu23gf7OmjUhE/Ckjf3LnP/////+/u7AkvrIlPjFkf/8+vzNmmNGPeq8kGZJQPf29f/48fG8hvTFltSrhOC0if3Pn/3TqfvKlvjImLSScfzLm8OdeRcVFcCad6uEaP/06f/ix++4g4lnVMege4ZtVq2MbTEqJLuUdPnJmua5jqiIanlZStnS0P7XrvSvkSEbGvv7+mhMRLmRcnVbVH9nUd3W1CQfHVJEN45sVMyiftCpgv/t2vvKl4tzbfe6lfbDj//gwZiEf3hfWK2cmG1OQSslIH5kXhMSE82lfh0ZGOzo5/bHmNerg2ZUQ5Z6YP7buPTBjPvFmvrDmP7Rova2lPGmjpWBe+S2jNuuhe/s67WppHNeS3pkT9LLyNbNy2pLQJ+AZKF9YLGKbNivhoNtZvm/lvOpj6KPijkvKIRiUfO/iv/w4JuHgsW6t454csnAvd6zi5VyWqaAZkk8MY1yWaWFZ2FQQP3Ys/7lzLKjnsG1sXFWT25aSH5eTmxRSYhxa1xMPb2wrKWTjk4+NHJTRvDBlJJ2XNyxiH9pYTwmGGlXR/Ty8Z54YT80K83Fwvn4+Fg+NLaPbsCXd/7Tpf/q1eLc2+Xh34x2cJt6X+jj4nVZP5B9d15DNUEuIf7dvLuuqUM4L87EwpN4X6iEYf3r2O/BlLGQcO+7hIhnS7+XcdOngUYwHv39/fHClWVLNM3EwbyhjKCWj/rz7KT+yIYAAABJdFJOUwAWYFnuCab85ipmBgWqbLkTA8icQAyL2yTSAR74kc15MDVyvBhC6q538NX189O12OCx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" class="user-avatar" width="40px"/>
                <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <router-link class='inlineBlock' to="/">
                    <el-dropdown-item>
                        首页
                    </el-dropdown-item>
                </router-link>
                <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
                    <el-dropdown-item>
                        项目地址
                    </el-dropdown-item>
                </a>
                <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </el-menu>
</template>

<script>
    import { mapGetters } from 'vuex';
    import Levelbar from './Levelbar';
    import TabsView from './TabsView';
    import Hamburger from 'components/Hamburger';
    import Screenfull from 'components/Screenfull';
    import ErrorLog from 'components/ErrLog';
    import errLogStore from 'store/errLog';

    export default {
      components: {
        Levelbar,
        TabsView,
        Hamburger,
        ErrorLog,
        Screenfull
      },
      data() {
        return {
          log: errLogStore.state.errLog
        }
      },
      computed: {
        ...mapGetters([
          'sidebar',
          'name',
          'avatar'
        ])
      },
      methods: {
        toggleSideBar() {
          this.$store.dispatch('ToggleSideBar')
        },
        logout() {
          this.$store.dispatch('LogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }
        .screenfull{
             position: absolute;
             right: 90px;
             top: 16px;
             color: red;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top:5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>



